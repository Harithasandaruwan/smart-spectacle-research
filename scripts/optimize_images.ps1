Add-Type -AssemblyName System.Drawing

$srcDir = "public\images\team"
$destDir = "images\team"

Get-ChildItem $srcDir | ForEach-Object {
    $file = $_
    $destPath = Join-Path $destDir $file.Name
    if ($file.Extension -eq '.jpg' -or $file.Extension -eq '.jpeg' -or $file.Extension -eq '.png') {
        $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
        $w = $bmp.Width
        $h = $bmp.Height
        
        $maxDim = 600
        if ($w -gt $maxDim -or $h -gt $maxDim) {
            if ($w -gt $h) {
                $newW = $maxDim
                $newH = [int]($h * ($maxDim / $w))
            } else {
                $newH = $maxDim
                $newW = [int]($w * ($maxDim / $h))
            }
            $resized = New-Object System.Drawing.Bitmap $newW, $newH
            $g = [System.Drawing.Graphics]::FromImage($resized)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.DrawImage($bmp, 0, 0, $newW, $newH)
            $g.Dispose()
            
            # Save as format
            if ($file.Extension -eq '.png') {
                $resized.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
            } else {
                $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
                $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)
                $resized.Save($destPath, $codec, $encoderParams)
            }
            $resized.Dispose()
            Write-Host "Resized $($file.Name): from ${w}x${h} to ${newW}x${newH}"
        } else {
            Copy-Item $file.FullName $destPath -Force
            Write-Host "Copied $($file.Name) as is"
        }
        $bmp.Dispose()
    }
}
