"""Build the local research-concept spectacle, GLB, and transparent studio image.

Run with Blender 5.1:
  blender --background --python scripts/build_spectacle.py

Geometry is intentionally a concept illustration, not an engineering specification.
All exported assembly roots have identity transforms; front is +Z and arms run -Z.
No external models, image textures, or environment assets are needed.
"""

import bpy
import math
import sys
import tempfile
from mathutils import Matrix, Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "public/models/smart-spectacle.glb"
IMAGE_PATH = ROOT / "public/images/smart-spectacle-concept.png"
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
IMAGE_PATH.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for block in bpy.data.materials:
    bpy.data.materials.remove(block)


def material(name, color, roughness=0.35, metallic=0.0, transmission=0.0, ior=1.45):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Transmission Weight"].default_value = transmission
    shader.inputs["IOR"].default_value = ior
    shader.inputs["Coat Weight"].default_value = 0.15 if transmission else 0.12
    shader.inputs["Coat Roughness"].default_value = 0.15
    return mat


navy = material("Navy satin polymer", (0.009, 0.021, 0.043), 0.31)
rubber = material("Soft-touch temple tips", (0.012, 0.021, 0.037), 0.49)
metal = material("Brushed titanium hinges", (0.29, 0.36, 0.42), 0.28, 0.82)
bright_metal = material("Optical bezel alloy", (0.38, 0.48, 0.54), 0.22, 0.88)
teal = material("Restrained teal accent", (0.025, 0.36, 0.34), 0.29, 0.35)
black = material("Recessed optical cavity", (0.004, 0.009, 0.015), 0.34)
lens_mat = material("Clear curved lenses", (0.80, 0.94, 0.98), 0.065, transmission=0.92, ior=1.46)
camera_glass = material("Camera optical glass", (0.012, 0.049, 0.066), 0.055, metallic=0.12, transmission=0.4, ior=1.52)
sensor_glass = material("Distance sensor glass", (0.018, 0.040, 0.047), 0.10, metallic=0.12)
pad_mat = material("Translucent silicone nose pads", (0.67, 0.75, 0.76), 0.38, transmission=0.38, ior=1.40)

roots = {}
for name in ("FrameAssembly", "LensAssembly", "CameraAssembly", "SensorAssembly"):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    roots[name] = obj


def mesh_object(name, verts, faces, mat, parent):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    obj.parent = roots[parent]
    for poly in mesh.polygons:
        poly.use_smooth = True
    return obj


def rounded_box(name, location, dimensions, bevel, mat, parent):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    obj.parent = roots[parent]
    mod = obj.modifiers.new("Manufactured edge radius", "BEVEL")
    mod.width = bevel
    mod.segments = 4
    mod.affect = "EDGES"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod.name)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    normals = obj.modifiers.new("Weighted surface normals", "WEIGHTED_NORMAL")
    bpy.ops.object.modifier_apply(modifier=normals.name)
    return obj


def cylinder(name, location, radius, depth, mat, parent, axis="z", vertices=40):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    if axis == "y":
        obj.rotation_euler.x = math.pi / 2
    elif axis == "x":
        obj.rotation_euler.y = math.pi / 2
    obj.data.materials.append(mat)
    obj.parent = roots[parent]
    bevel = obj.modifiers.new("Machined rim", "BEVEL")
    bevel.width = min(radius * 0.1, depth * 0.18)
    bevel.segments = 2
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def annulus(name, center, outside, inside, depth, mat, parent, count=48):
    verts, faces = [], []
    cx, cy, cz = center
    for z, radius in ((-depth / 2, outside), (depth / 2, outside), (depth / 2, inside), (-depth / 2, inside)):
        for j in range(count):
            a = j * 2 * math.pi / count
            verts.append((cx + radius * math.cos(a), cy + radius * math.sin(a), cz + z))
    for k in range(4):
        for j in range(count):
            next_j = (j + 1) % count
            next_k = (k + 1) % 4
            faces.append((k * count + j, k * count + next_j, next_k * count + next_j, next_k * count + j))
    return mesh_object(name, verts, faces, mat, parent)


def signed_power(value, power):
    return math.copysign(abs(value) ** power, value)


def contour(a, b, theta):
    # A generous lower corner radius and gently tapered bottom make a credible frame silhouette.
    x = a * signed_power(math.cos(theta), 0.57)
    y = b * signed_power(math.sin(theta), 0.69)
    x *= 1 + 0.035 * y / b
    return x, y


def front_z(x):
    # Slight wrap at the outer edges, with no awkward flat-plane join to the temples.
    return 0.065 - 0.075 * (x / 1.95) ** 2


def make_frame(side):
    cx, cy, count, profile = side * 0.985, 0.025, 112, 12
    verts, faces = [], []
    for i in range(count):
        angle = i * 2 * math.pi / count
        x, y = contour(0.805, 0.57, angle)
        before = Vector(contour(0.805, 0.57, angle - 0.002))
        after = Vector(contour(0.805, 0.57, angle + 0.002))
        tangent = (after - before).normalized()
        normal = Vector((tangent.y, -tangent.x))
        for j in range(profile):
            p = j * 2 * math.pi / profile
            # Rounded rectangular ring profile: broad satin face, genuinely beveled edges.
            radial = 0.073 * signed_power(math.cos(p), 0.58)
            depth = 0.086 * signed_power(math.sin(p), 0.60)
            px, py = cx + x + radial * normal.x, cy + y + radial * normal.y
            verts.append((px, py, front_z(px) + depth))
    for i in range(count):
        for j in range(profile):
            faces.append((i * profile + j, ((i + 1) % count) * profile + j,
                          ((i + 1) % count) * profile + (j + 1) % profile,
                          i * profile + (j + 1) % profile))
    mesh_object("Right beveled lens rim" if side > 0 else "Left beveled lens rim", verts, faces, navy, "FrameAssembly")


def catmull(points, samples_per_segment=8):
    points = [Vector(p) for p in points]
    curve = []
    for i in range(len(points) - 1):
        p0, p1 = points[max(0, i - 1)], points[i]
        p2, p3 = points[i + 1], points[min(len(points) - 1, i + 2)]
        for j in range(samples_per_segment):
            t = j / samples_per_segment
            curve.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t*t
                                + (-p0 + 3 * p1 - 3 * p2 + p3) * t*t*t))
    curve.append(points[-1])
    return curve


def sweep(name, points, widths, heights, mat, parent, profile=12):
    curve = catmull(points)
    verts, faces = [], []
    for i, position in enumerate(curve):
        t = i / (len(curve) - 1)
        tangent = (curve[min(i + 1, len(curve) - 1)] - curve[max(0, i - 1)]).normalized()
        # Always keep the section upright, then derive the perpendicular lateral axis.
        vertical = Vector((0, 1, 0))
        if abs(tangent.dot(vertical)) > 0.94:
            vertical = Vector((0, 0, 1))
        lateral = tangent.cross(vertical).normalized()
        upright = lateral.cross(tangent).normalized()
        w = widths[0] * (1 - t) + widths[1] * t
        h = heights[0] * (1 - t) + heights[1] * t
        for j in range(profile):
            p = j * math.tau / profile
            point = position + lateral * w * signed_power(math.cos(p), 0.58) + upright * h * signed_power(math.sin(p), 0.58)
            verts.append(tuple(point))
    for i in range(len(curve) - 1):
        for j in range(profile):
            faces.append((i * profile + j, (i + 1) * profile + j, (i + 1) * profile + (j + 1) % profile,
                          i * profile + (j + 1) % profile))
    faces += [tuple(reversed(tuple(range(profile)))), tuple((len(curve) - 1) * profile + j for j in range(profile))]
    return mesh_object(name, verts, faces, mat, parent)


for side in (-1, 1):
    make_frame(side)
    # The structural endpiece connects the rim, electronics housing and hinged arm.
    rounded_box(f"Endpiece {side}", (side * 1.817, 0.292, -0.024), (0.235, 0.238, 0.226), 0.055, navy, "FrameAssembly")
    rounded_box(f"Temple electronics {side}", (side * 1.94, 0.269, -0.423), (0.212, 0.240, 0.63), 0.068, navy, "FrameAssembly")
    sweep(f"Curved temple {side}", [(side * 1.93, 0.27, -0.53), (side * 2.005, 0.245, -0.96),
          (side * 2.065, 0.20, -1.51), (side * 2.04, 0.11, -1.98), (side * 1.955, -0.035, -2.35),
          (side * 1.92, -0.28, -2.64)], (0.077, 0.053), (0.102, 0.068), navy, "FrameAssembly")
    sweep(f"Rubberized ear bend {side}", [(side * 2.033, 0.093, -2.035), (side * 1.956, -0.029, -2.344),
          (side * 1.92, -0.28, -2.64), (side * 1.952, -0.415, -2.71)], (0.073, 0.057), (0.088, 0.075), rubber, "FrameAssembly")
    # Visible machined hinge and tiny recessed head; no unsupported floating parts.
    cylinder(f"Hinge barrel {side}", (side * 1.914, 0.282, -0.184), 0.064, 0.249, metal, "FrameAssembly", "y", 28)
    cylinder(f"Hinge screw {side}", (side * 1.914, 0.409, -0.184), 0.044, 0.014, bright_metal, "FrameAssembly", "y", 24)
    rounded_box(f"Screw slot {side}", (side * 1.914, 0.418, -0.184), (0.051, 0.006, 0.009), 0.002, black, "FrameAssembly")
    # A thin accent insert and restrained ventilation detail along the outside of each temple.
    rounded_box(f"Teal temple insert {side}", (side * 2.052, 0.267, -0.40), (0.011, 0.025, 0.284), 0.005, teal, "FrameAssembly")
    for vent in range(3):
        rounded_box(f"Temple vent {side}:{vent}", (side * 2.048, 0.191, -0.49 + vent * 0.06), (0.014, 0.041, 0.016), 0.004, black, "FrameAssembly")

# One uninterrupted bridge joins the inner upper corners of both rims.
sweep("Continuous sculpted nose bridge", [(-0.223, 0.304, 0.061), (-0.142, 0.350, 0.067),
      (0, 0.382, 0.069), (0.142, 0.350, 0.067), (0.223, 0.304, 0.061)],
      (0.073, 0.073), (0.064, 0.064), navy, "FrameAssembly")
for side in (-1, 1):
    sweep(f"Nose pad support {side}", [(side * 0.206, 0.16, -0.001), (side * 0.251, 0.02, -0.138),
          (side * 0.289, -0.145, -0.163)], (0.027, 0.028), (0.027, 0.027), metal, "FrameAssembly", 8)
    pad = rounded_box(f"Silicone nose pad {side}", (side * 0.29, -0.144, -0.15), (0.127, 0.254, 0.079), 0.037, pad_mat, "FrameAssembly")
    pad.rotation_euler.z = side * 0.29


def make_lens(side):
    count, rings, cx, cy = 88, 9, side * 0.985, 0.025
    verts, faces = [], []
    # Front and back surfaces are genuinely curved with a small solid edge thickness.
    for back in (False, True):
        verts.append((cx, cy, front_z(cx) + 0.07 - (0.018 if back else 0)))
        for ring in range(1, rings + 1):
            r = ring / rings
            for j in range(count):
                dx, dy = contour(0.738, 0.507, j * math.tau / count)
                x, y = cx + r * dx, cy + r * dy
                z = front_z(x) + 0.07 * (1 - r*r) - (0.018 if back else 0)
                verts.append((x, y, z))
    layer = 1 + rings * count
    for back in (False, True):
        start = layer if back else 0
        for j in range(count):
            tri = (start, start + 1 + j, start + 1 + (j + 1) % count)
            faces.append(tuple(reversed(tri)) if back else tri)
        for ring in range(rings - 1):
            for j in range(count):
                a = start + 1 + ring * count + j
                b = start + 1 + ring * count + (j + 1) % count
                quad = (a, a + count, b + count, b)
                faces.append(tuple(reversed(quad)) if back else quad)
    for j in range(count):
        a = 1 + (rings - 1) * count + j
        b = 1 + (rings - 1) * count + (j + 1) % count
        faces.append((a, a + layer, b + layer, b))
    mesh_object(f"Curved optical lens {side}", verts, faces, lens_mat, "LensAssembly")


for side in (-1, 1):
    make_lens(side)


def aperture_housing(name, center, dimensions, holes, mat, parent):
    obj = rounded_box(name, center, dimensions, 0.046, mat, parent)
    for x, y, radius in holes:
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=dimensions[2] + 0.2,
                                           location=(x, y, center[2]))
        cutter = bpy.context.object
        boolean = obj.modifiers.new("Recessed optical aperture", "BOOLEAN")
        boolean.operation = "DIFFERENCE"
        boolean.solver = "EXACT"
        boolean.object = cutter
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=boolean.name)
        bpy.data.objects.remove(cutter, do_unlink=True)
    return obj


# Front-facing camera sits in the outer endpiece, with actual recessed optics.
camera_center = (1.794, 0.303, 0.034)
aperture_housing("Integrated camera housing", camera_center, (0.331, 0.31, 0.301),
                 [(1.794, 0.323, 0.098)], navy, "CameraAssembly")
annulus("Camera machined bezel", (1.794, 0.323, 0.183), 0.108, 0.088, 0.017, bright_metal, "CameraAssembly")
annulus("Camera internal barrel", (1.794, 0.323, 0.134), 0.092, 0.068, 0.075, black, "CameraAssembly")
cylinder("Recessed camera objective", (1.794, 0.323, 0.118), 0.068, 0.014, camera_glass, "CameraAssembly")
annulus("Inner optical aperture", (1.794, 0.323, 0.109), 0.039, 0.025, 0.008, black, "CameraAssembly", 32)
cylinder("Camera optical core", (1.794, 0.323, 0.104), 0.025, 0.009, camera_glass, "CameraAssembly", vertices=24)
rounded_box("Camera teal index", (1.794, 0.202, 0.187), (0.072, 0.014, 0.006), 0.005, teal, "CameraAssembly")

# Compact paired emitter/receiver windows suggest distance sensing without claiming a specific device.
aperture_housing("Compact distance sensor housing", (-1.800, 0.304, 0.018), (0.345, 0.249, 0.270),
                 [(-1.861, 0.322, 0.043), (-1.744, 0.322, 0.047)], navy, "SensorAssembly")
for index, x in enumerate((-1.861, -1.744)):
    annulus(f"Sensor recessed bezel {index}", (x, 0.322, 0.154), 0.049, 0.038, 0.010, metal, "SensorAssembly", 32)
    cylinder(f"Sensor optical window {index}", (x, 0.322, 0.143), 0.038, 0.009, sensor_glass, "SensorAssembly", vertices=32)
rounded_box("Sensor teal index", (-1.800, 0.229, 0.157), (0.058, 0.012, 0.005), 0.004, teal, "SensorAssembly")

# Join pieces sharing a material within each assembly. This keeps the GLB to a small
# draw-call count without changing the four parent pivots used by the scroll scene.
for root_name, parent in roots.items():
    pieces = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.parent == parent]
    by_material = {}
    for obj in pieces:
        by_material.setdefault(obj.data.materials[0].name, []).append(obj)
    for mat_name, objects in by_material.items():
        bpy.ops.object.select_all(action="DESELECT")
        for obj in objects:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        if len(objects) > 1:
            bpy.ops.object.join()
        joined = bpy.context.object
        joined.name = f"{root_name}_{mat_name.replace(' ', '_')}"
        # Preserve assembled coordinates, but normalize the child object's origin too.
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

bpy.ops.object.select_all(action="DESELECT")
for obj in bpy.context.scene.objects:
    if obj.type == "MESH" or obj.name in roots:
        obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(MODEL_PATH), export_format="GLB", use_selection=True,
                          export_yup=False, export_apply=True, export_animations=False,
                          export_cameras=False, export_lights=False, export_materials="EXPORT")

# Self-contained studio render for no-WebGL and reduced-motion presentation.
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 96
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.cycles.transmission_bounces = 6
scene.render.resolution_x = 1100
scene.render.resolution_y = 750
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.cycles.film_transparent_glass = True
scene.cycles.film_transparent_roughness = 0.08
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = str(IMAGE_PATH)
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.82, 0.88, 0.96, 1)
scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.4
scene.view_settings.view_transform = "AgX"


def area_light(name, position, target, energy, size, color, shape="DISK", size_y=None):
    data = bpy.data.lights.new(name, type="AREA")
    data.energy = energy
    data.shape = shape
    data.size = size
    if size_y is not None:
        data.size_y = size_y
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


area_light("Large soft key", (1.0, 5.5, 4.8), (0, 0, -0.6), 750, 5.0, (0.93, 0.97, 1.0))
area_light("Wide front fill", (-4.0, 1.5, 5.5), (0, 0, -0.4), 500, 4.0, (0.83, 0.92, 1.0))
area_light("Rear strip rim", (2.5, 4.0, -4.0), (0, 0, -1.0), 950, 5.0, (0.80, 1.0, 0.97), "RECTANGLE", 1.5)
area_light("Optical reflection strip", (0, 3.8, 3.0), (0, 0, 0), 220, 5.0, (1.0, 1.0, 1.0), "RECTANGLE", 0.55)
area_light("Side edge card", (-4.0, 0.5, -1.0), (0, 0, -0.5), 350, 3.0, (0.94, 0.96, 1.0))

camera_data = bpy.data.cameras.new("Studio product camera")
camera = bpy.data.objects.new("Studio product camera", camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (4.5, 2.6, 7.2)
target = Vector((0.0, -0.03, -0.82))
forward = (target - camera.location).normalized()
right = forward.cross(Vector((0, 1, 0))).normalized()
up = right.cross(forward).normalized()
camera.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
camera_data.type = "ORTHO"
camera_data.ortho_scale = 5.65
camera_data.lens = 60
scene.camera = camera
bpy.ops.render.render(write_still=True)

bounds = []
for obj in bpy.context.scene.objects:
    if obj.type == "MESH":
        bounds.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
minimum = tuple(min(v[i] for v in bounds) for i in range(3))
maximum = tuple(max(v[i] for v in bounds) for i in range(3))
vertices = sum(len(obj.data.vertices) for obj in bpy.context.scene.objects if obj.type == "MESH")
polygons = sum(len(obj.data.polygons) for obj in bpy.context.scene.objects if obj.type == "MESH")
print("MODEL_RESULT", {"bounds_min": minimum, "bounds_max": maximum, "vertices": vertices, "polygons": polygons,
                       "glb_bytes": MODEL_PATH.stat().st_size, "image_bytes": IMAGE_PATH.stat().st_size})

if "--review-views" in sys.argv:
    review_directory = Path(tempfile.mkdtemp(prefix="smart-spectacle-review-"))
    scene.render.resolution_x = 850
    scene.render.resolution_y = 600
    scene.cycles.samples = 48
    for view, location, target in (
        ("front", (0, 0.4, 8), (0, 0.03, -0.7)),
        ("side", (8, 2.8, 1.7), (0, 0, -1.15)),
    ):
        camera.location = location
        forward = (Vector(target) - camera.location).normalized()
        right = forward.cross(Vector((0, 1, 0))).normalized()
        up = right.cross(forward).normalized()
        camera.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
        scene.render.filepath = str(review_directory / f"{view}.png")
        bpy.ops.render.render(write_still=True)
    print("VIEW_RESULT", str(review_directory))
