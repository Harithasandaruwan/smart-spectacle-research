const studies = [
  {
    id: 4,
    study: 'Plikynas et al. (2020)',
    category: 'Review of indoor navigation technologies',
    approach:
      'Reviews indoor navigation technologies and relates their features to the needs of visually impaired users.',
    contribution:
      'Provides a framework for comparing navigation approaches and user requirements.',
    relevance:
      'Guides our selection of sensing, positioning, and feedback methods.',
    consideration:
      'This is a literature review rather than an implemented device for direct prototype comparison.',
  },
  {
    id: 8,
    study: 'López-de-Ipiña et al. (2011)',
    category: 'Assisted shopping and indoor navigation',
    approach:
      'Uses RFID and QR-code-based mobile technology to support navigation and product recognition in supermarkets.',
    contribution:
      'Demonstrates shopping assistance in an environment prepared with identification markers.',
    relevance:
      'Provides a comparison for our proposed vision-and-IMU positioning approach.',
    consideration:
      'Deployment depends on environment-specific RFID markers and product identification codes.',
  },
  {
    id: 11,
    study: 'Z. Chen et al. (2021)',
    category: 'Wearable semantic visual SLAM',
    approach:
      'Combines semantic visual simultaneous localization and mapping with a mobile computing platform.',
    contribution:
      'Demonstrates a wearable approach to visual localization and navigation.',
    relevance:
      'Informs the use of visual scene information for indoor position awareness.',
    consideration:
      'Our selected hardware and positioning method require separate evaluation under our indoor test conditions.',
  },
  {
    id: 2,
    study: 'Y. Chen et al. (2023)',
    category: 'Wearable obstacle perception',
    approach:
      'Combines compressed YOLOv3, stereo distance measurement, Raspberry Pi hardware, an inference accelerator, and tactile feedback.',
    contribution:
      'Demonstrates local obstacle recognition, distance estimation, and vibration-based guidance.',
    relevance:
      'Informs edge model optimization and the combination of object detection with distance information.',
    consideration:
      'The implementation uses additional accelerator hardware; its performance cannot be assumed for our proposed device.',
  },
  {
    id: 3,
    study: 'Redmon et al. (2016)',
    category: 'Original YOLO object detector',
    approach:
      'Predicts object bounding boxes and classes using a single neural network evaluation.',
    contribution:
      'Introduces a unified approach to real-time object detection.',
    relevance:
      'Provides foundational background for our vision-based danger detection component.',
    consideration:
      'Object detection alone does not provide indoor positioning, emergency monitoring, or a complete navigation system.',
  },
]

function LiteratureSurvey() {
  return (
    <section
      id="literature"
      className="section"
      aria-labelledby="literature-heading"
    >
        <div className="container">
          <p className="eyebrow">Related research</p>
          <h2 id="literature-heading">Literature survey</h2>

          <p className="section-intro">
            Selected literature covers indoor navigation, wearable
            perception, localization, and object detection. These studies
            inform the design of our proposed smart spectacle system.
          </p>

          <div className="literature-summary">
            <article className="card">
              <h3>Indoor navigation and positioning</h3>

              <p>
                Plikynas et al. review indoor navigation technologies in
                relation to user needs{' '}
                <a href="#reference-4" aria-label="Read reference 4">
                  [4]
                </a>
                . The assisted-shopping system by López-de-Ipiña et al.
                uses RFID and QR codes in a prepared supermarket
                environment{' '}
                <a href="#reference-8" aria-label="Read reference 8">
                  [8]
                </a>
                . Chen et al. investigate wearable navigation through
                semantic visual localization and mapping{' '}
                <a href="#reference-11" aria-label="Read reference 11">
                  [11]
                </a>
                .
              </p>
            </article>

            <article className="card">
              <h3>Wearable perception and object detection</h3>

              <p>
                Chen et al. combine compressed object detection, stereo
                distance measurement, and tactile feedback in a wearable
                system{' '}
                <a href="#reference-2" aria-label="Read reference 2">
                  [2]
                </a>
                . The original YOLO work introduces a unified object
                detection approach{' '}
                <a href="#reference-3" aria-label="Read reference 3">
                  [3]
                </a>
                . These studies inform our proposed hazard detection and
                distance-aware feedback.
              </p>
            </article>
          </div>

          <div className="notice">
            <strong>Additional background and technical sources</strong>

            <p>
              WHO provides background on vision impairment{' '}
              <a href="#reference-5" aria-label="Read reference 5">
                [5]
              </a>
              . Related work covers LiDAR characterization{' '}
              <a href="#reference-1" aria-label="Read reference 1">
                [1]
              </a>
              , IoT smart glasses{' '}
              <a href="#reference-6" aria-label="Read reference 6">
                [6]
              </a>
              , wearable assistive design{' '}
              <a href="#reference-7" aria-label="Read reference 7">
                [7]
              </a>
              , deep-learning smart glasses{' '}
              <a href="#reference-9" aria-label="Read reference 9">
                [9]
              </a>
              , and Raspberry Pi object recognition with voice feedback{' '}
              <a href="#reference-10" aria-label="Read reference 10">
                [10]
              </a>
              .
            </p>

            <p>
              The TF-Luna manual is a hardware documentation source{' '}
              <a href="#reference-12" aria-label="Read reference 12">
                [12]
              </a>
              . Radford et al. provide background for investigating speech
              recognition in the proposed voice-activated SOS workflow{' '}
              <a href="#reference-13" aria-label="Read reference 13">
                [13]
              </a>
              . Neither source establishes the performance of our
              integrated prototype.
            </p>
          </div>

          <h3 className="comparison-heading">
            Comparison of selected literature
          </h3>

          <p id="literature-table-note" className="table-note">
            “Relevance” and “design consideration” describe our
            interpretation for this project. They are not claims that the
            papers evaluated our proposed system. On smaller screens,
            scroll horizontally to view all columns.
          </p>

          <div
            className="literature-table-wrapper"
            role="region"
            aria-label="Literature comparison table"
            aria-describedby="literature-table-note"
            tabIndex={0}
          >
            <table className="literature-table">
              <caption>
                Selected studies and their relevance to R26-IT-134
              </caption>

              <thead>
                <tr>
                  <th scope="col">Study</th>
                  <th scope="col">Approach</th>
                  <th scope="col">Contribution</th>
                  <th scope="col">Relevance to our project</th>
                  <th scope="col">Design consideration</th>
                </tr>
              </thead>

              <tbody>
                {studies.map((study) => (
                  <tr key={study.id}>
                    <th scope="row">
                      <strong>{study.study}</strong>

                      <span className="study-category">
                        {study.category}
                      </span>

                      <a
                        href={`#reference-${study.id}`}
                        aria-label={`Read reference ${study.id}`}
                      >
                        [{study.id}]
                      </a>
                    </th>

                    <td>{study.approach}</td>
                    <td>{study.contribution}</td>
                    <td>{study.relevance}</td>
                    <td>{study.consideration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="notice">
            <strong>Implications for our proposed system</strong>

            <p>
              We use this literature to guide wearable sensing, local
              hazard detection, indoor positioning, and user feedback.
              Our project additionally proposes guardian safety
              monitoring. Evaluation is needed to establish the
              integrated prototype’s accuracy, latency, reliability,
              and usability.
            </p>
          </div>
        </div>
    </section>
  )
}

export default LiteratureSurvey
