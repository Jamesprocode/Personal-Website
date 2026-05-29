const projects = [
  {
    id: 1,
    slug: 'omr',
    title: 'Full-Page Optical Music Recognition of Jazz Lead Sheets',
    venue: 'Music Informatics Lab research project · ISMIR 2026 Submission · Under Review',
    shortTitle: 'OMR for Jazz',
    description:
      'Imagine walking into a jam session with your own handwritten lead sheet — and needing to hand a transposed copy to the sax and trumpet players on the spot. A chart in your notebook should be editable and transposable in any key, on the fly. We present the first end-to-end OMR system for handwritten jazz lead sheets at the full-page level — adapting the Sheet Music Transformer with curriculum learning, and proposing chord-specific metrics that isolate harmonic from melodic transcription performance.',
    tags: ['Deep Learning', 'Transformers', 'OMR', 'Python'],
    period: 'Aug 2025 – present',
    category: 'Computer Vision',
    github: null,
    comingSoon: ['GitHub', 'Paper'],
    tileImage: '/projects/omr/pipeline-output.jpg',
    body: [
      // ---------- 1. Dataset ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'Dataset',
      },
      {
        kind: 'sideBySide',
        imageSide: 'left',
        text:
          'JazzMus [1]: 163 unique jazz standards, 326 synthetic pages (MuseScore Classical + MuseJazz fonts) and 293 handwritten copies, with Humdrum/MusicXML annotations and per-staff bounding boxes. We contributed two annotation fixes back to the corpus via pull requests on Hugging Face.',
        image: {
          src: '/projects/omr/sample-clean.jpg',
          alt: 'A clean handwritten lead sheet from the JazzMus corpus — "Embraceable You".',
          caption: 'Clean handwritten sample from JazzMus — "Embraceable You", 6 staves, evenly spaced chord symbols.',
        },
      },

      // ---------- 3. Model ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2.1',
        text: 'Model Architecture',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'Sheet Music Transformer (SMT) [2]: ConvNeXt encoder + autoregressive Transformer decoder, output Humdrum **kern. To support multi-staff output, we extend the vocabulary by one token — <linebreak> — and reuse the staff-level pretrained weights [1] unchanged. The methodological work is in the training curriculum, not the architecture.',
        image: {
          src: '/projects/omr/architecture.jpg',
          alt: 'Sheet Music Transformer encoder-decoder architecture.',
          caption: 'SMT — ConvNeXt encoder + autoregressive Transformer decoder.',
        },
      },

      // ---------- 4. Baseline ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2.2',
        text: 'Detect-and-Concatenate Baseline',
      },
      {
        kind: 'text',
        content:
          'No full-page baseline existed for handwritten jazz lead sheets. We construct one: YOLOv11s detects each staff, the pretrained staff-level SMT [1] transcribes each crop independently, and the outputs are concatenated into a page-level Humdrum file. Post-processing recovers missed detections, removes duplicate boxes via vertical IoU, and expands crops upward so chord symbols above the staff are captured.',
      },
      {
        kind: 'image',
        src: '/projects/omr/baseline-flowchart.svg',
        alt: 'Detect-and-concatenate baseline pipeline flowchart.',
        caption: 'Baseline pipeline — staff detection, per-staff inference, full-page evaluation.',
      },
      {
        kind: 'image',
        src: '/projects/omr/pipeline-output.jpg',
        alt: 'Detect-and-concatenate baseline output overlaid on input lead sheet.',
        caption: 'Detect-and-concatenate baseline output — predictions (right) re-laid against the input lead sheet (left).',
      },

      // ---------- 5. Masking curriculum ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2.3',
        text: 'Masking Curriculum',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          '9 stages of vertical masking: at stage k, only the top k staves are visible (input and ground truth both truncated). The schedule advances when validation error stays below 20% for 3 consecutive checks. Experience replay (r ∈ {0, 0.25, 0.5, 1.0}) controls how many earlier-stage samples are retained as the curriculum progresses, preventing the model from forgetting shorter-input behavior.',
        image: {
          src: '/projects/omr/masking-example.png',
          alt: 'Masking curriculum example — top-N staves visible per stage.',
          caption: 'Masking curriculum — each stage k reveals the top k staves of a real page.',
        },
      },

      // ---------- 6. Stacking curriculum ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2.4',
        text: 'Stacking Curriculum',
      },
      {
        kind: 'sideBySide',
        imageSide: 'left',
        text:
          'Alternative curriculum: synthesize multi-staff inputs by stacking individual staff crops from different pages. Produces ~19× more training samples (32,563 vs 1,688), but introduces layout artifacts — inconsistent staff lengths, mismatched bar counts, broken progressions across stacked staves.',
        image: {
          src: '/projects/omr/stacking-example.png',
          alt: 'Stacking curriculum example — staves from different pages stacked into a synthetic page.',
          caption: 'Stacking curriculum — stage-k samples synthesized by stacking k individual staff crops.',
        },
      },

      // ---------- 7. Metrics ----------
      {
        kind: 'heading',
        eyebrow: 'Section 3',
        text: 'Evaluation Metrics',
      },
      {
        kind: 'list',
        intro:
          'We follow prior OMR work and report three standard edit-distance error rates, each computed as the Levenshtein edit distance between prediction and ground truth divided by the total ground-truth units, multiplied by 100. We also compute melody-only variants restricted to the **kern spine (CER_Melo, SER_Melo, LER_Melo).',
        items: [
          { label: 'CER', body: 'Character Error Rate — edit distance over individual characters in the Humdrum output.' },
          { label: 'SER', body: 'Symbol Error Rate — edit distance over individual musical symbols (tokens).' },
          { label: 'LER', body: 'Line Error Rate — edit distance over whole lines; implicitly captures line-level structural errors such as a chord assigned to the wrong note line.' },
        ],
      },
      {
        kind: 'list',
        variant: 'highlight',
        intro:
          'New contribution: standard metrics conflate melodic and harmonic errors. We propose two chord-oriented metrics, computed over the chord-symbol sequence extracted from the **mxhm spine, that isolate harmonic transcription performance:',
        items: [
          { label: 'SER_Root', body: 'Edit distance over chord symbols reduced to root-note tokens only. Measures whether the model recovers the harmonic backbone of the piece, independently of extensions or inversions.' },
          { label: 'SER_Chord', body: 'Edit distance over full chord symbols — root + quality + extensions + inversion. A chord counts as correct only when the entire symbolic form is transcribed exactly.' },
        ],
      },

      // ---------- 8. Results ----------
      {
        kind: 'heading',
        eyebrow: 'Section 4.1',
        text: 'Results — Overall',
      },
      {
        kind: 'table',
        headers: ['Method', 'CER', 'SER', 'LER'],
        rows: [
          { cells: ['Baseline', '13.55', '12.78', '32.35'] },
          { cells: ['Masking, r = 0', '17.61', '16.80', '31.41'], divider: true },
          { cells: ['Masking, r = 0.25', '17.48', '16.73', '29.13'] },
          { cells: ['Masking, r = 0.50', '14.11', '13.59', '26.25'] },
          { cells: ['Masking, r = 1.00', '13.32', '12.50', '23.15*'], highlight: true },
          { cells: ['Stacking, r = 0.25', '24.30', '22.90', '44.55'], divider: true },
        ],
        caption: 'Table 1 — Overall full-page recognition on the test set. Masking with full replay is the only model that beats the baseline across all three metrics.',
        footnote: '* p < 0.01 over baseline (paired test). Lower is better.',
      },

      {
        kind: 'heading',
        eyebrow: 'Section 4.2',
        text: 'Results — Melodic and Harmonic',
      },
      {
        kind: 'table',
        headers: ['Metric', 'Baseline', 'Masking, r=1.00', 'Δ'],
        rows: [
          { cells: ['CER_Melo', '11.96', '11.63', '−0.33'] },
          { cells: ['SER_Melo', '14.40', '13.02', '−1.38'] },
          { cells: ['LER_Melo', '26.66', '18.67*', '−7.99'] },
          { cells: ['SER_Root', '29.17', '21.25*', '−7.92'], divider: true },
          { cells: ['SER_Chord', '47.82', '30.67**', '−17.15'], highlight: true },
        ],
        caption: 'Table 2 — Spine-specific metrics. The full-page model\'s largest gain is on SER_Chord (full chord symbol), where it outperforms the baseline by 17 absolute points.',
        footnote: '* p < 0.01, ** p < 0.001 (paired test). Lower is better.',
      },


      // ---------- References ----------
      {
        kind: 'heading',
        eyebrow: 'Key references',
        text: 'References',
      },
      {
        kind: 'references',
        items: [
          {
            id: '1',
            authors: 'Martinez-Sevilla, J. C., Foscarin, F., Garcia-Iasci, P., Rizo, D., Calvo-Zaragoza, J., & Widmer, G.',
            year: '2025',
            title: 'Optical Music Recognition of Jazz Lead Sheets',
            venue: 'Proceedings of the International Society for Music Information Retrieval Conference (ISMIR)',
            note: 'Introduces the JazzMus dataset and the staff-level baseline we build on.',
            url: 'https://grfia.dlsi.ua.es/jazz-omr/',
          },
          {
            id: '2',
            authors: 'Ríos-Vila, A., Calvo-Zaragoza, J., Rizo, D., & Paquet, T.',
            year: '2026',
            title: 'End-to-End Full-Page Optical Music Recognition for Pianoform Sheet Music',
            venue: 'International Journal of Computer Vision, 134(2), 49',
            note: 'Full-page extension of the Sheet Music Transformer (SMT) on pianoform scores. We adapt this curriculum-based full-page approach to handwritten jazz lead sheets.',
            url: 'https://doi.org/10.1007/s11263-025-02654-6',
          },
        ],
      },

      // ---------- Poster (moved to the end as final-page summary) ----------
      {
        kind: 'heading',
        eyebrow: 'Summary',
        text: 'Poster',
      },
      {
        kind: 'image',
        src: '/projects/omr/poster.jpg',
        alt: 'Project poster summarizing the system and results.',
        caption: 'Poster — one-page summary of architecture, training, and results.',
      },
    ],
  },

  {
    id: 2,
    slug: 'amt',
    title: 'Anticipatory Music Transformer for Shimon',
    venue: 'Robotic Musicianship Lab research project · In Progress, Oct 2025 – present',
    shortTitle: 'AMT × Shimon',
    description:
      'Imagine sitting in on a jam session with a four-armed marimba-playing robot. Shimon — built at Georgia Tech\'s Center for Music Technology — has four arms sharing one rail, each holding a single mallet, and improvises in real time alongside human musicians. We couple an Anticipatory Music Transformer with a Viterbi path planner so the planner\'s arm-feasibility cost feeds back into the model\'s sampling step, generating only music that Shimon can physically play.',
    tags: ['Music Transformer', 'Viterbi', 'Robotics', 'Python'],
    period: 'Oct 2025 – present',
    category: 'Musical Interaction',
    github: 'https://github.com/Jamesprocode/AMT',
    tileImage: '/projects/amt/shimon-detail.jpg',
    body: [
      // ---------- Demo video ----------
      {
        kind: 'video',
        src: '/projects/amt/demo.mp4',
        caption: 'Quick demo — jamming with Shimon, generated lines played live in the room.',
      },

      // ---------- The Robot ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'The Robot',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'Shimon is a four-armed robotic marimba player at Georgia Tech\'s Center for Music Technology. The arms share a single horizontal rail and cannot cross, each arm is wider than a single marimba bar, and rail movement is bounded by a ~130 ms/half-step speed limit. Any musical line the robot plays must be physically feasible under those constraints.',
        image: {
          src: '/projects/amt/shimon-detail.jpg',
          alt: 'Shimon, the four-armed robotic marimba player at Georgia Tech.',
          caption: 'Shimon — four arms, one shared rail, ~36 marimba bars.',
        },
      },
      {
        kind: 'sideBySide',
        imageSide: 'left',
        text:
          'Each arm carries a single mallet. The hard physical constraints — non-crossing, finite arm width, capped rail speed — turn any generative system\'s output into a feasibility problem before it can ever be performed. Naive rejection sampling on top of an unconstrained generator wastes most of the candidate space.',
        image: {
          src: '/projects/amt/shimon-icon.jpg',
          alt: 'Close-up of Shimon\'s arm and mallet over the marimba bars.',
          caption: 'Each arm carries a single mallet; arms cannot cross, rail movement is speed-capped.',
        },
      },

      // ---------- Generation ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2',
        text: 'Generation — Anticipatory Music Transformer',
      },
      {
        kind: 'text',
        content:
          'Stage one is an Anticipatory Music Transformer [1] pretrained on the Lakh MIDI corpus. AMT generates event-based MIDI tokens autoregressively, with anticipation control that lets the generator condition on future events specified by the user (or — in our coupling — by the planner).',
      },

      // ---------- Shimonizer ----------
      {
        kind: 'heading',
        eyebrow: 'Section 3',
        text: 'Shimonizer',
      },
      {
        kind: 'text',
        content:
          'The bridge between the AMT and Shimon is what we call the Shimonizer — a layer that analyzes the model\'s output and reshapes it into Shimon\'s own playing style. As AMT generates note by note, the Shimonizer reads each candidate against Shimon\'s physical reality — arm positions, speed limits, no-crossing rules — and feeds that analysis back into the model\'s sampling decision. The output isn\'t just music Shimon can play, but music that\'s recognizably his.',
      },
      {
        kind: 'list',
        intro: 'A few of the rules baked into the Shimonizer:',
        items: [
          { label: 'Tremolo on long notes', body: 'Any note held longer than about a second is replaced with rapid repeated strikes — the natural way a marimba sustains a pitch.' },
          { label: 'Capped polyphony', body: 'At most four notes can sound on the same onset, one per arm. Anything beyond the top four is dropped.' },
          { label: 'Chord stagger', body: 'Notes arriving within 10 ms of each other are spread apart by 10 ms each, so chords ring out as a quick roll rather than dead-simultaneous attacks.' },
        ],
      },

      // ---------- Planning ----------
      {
        kind: 'heading',
        eyebrow: 'Section 4',
        text: 'Viterbi Path Planner',
      },
      {
        kind: 'list',
        intro:
          'Under the hood of the Shimonizer is a Viterbi path planner that reformulates arm assignment as a shortest-path problem over a trellis whose states are (note, arm) pairs. Edge costs encode physical reality:',
        items: [
          { label: 'Travel cost', body: 'Proportional to the distance the rail must traverse between successive notes within the speed limit.' },
          { label: 'Crossing', body: '∞ — arms cannot swap order on the rail.' },
          { label: 'Speed cap', body: 'Moves faster than ~130 ms/half-step are infeasible — the edge gets infinite cost.' },
        ],
      },
      {
        kind: 'text',
        content:
          'The cost function follows Bretan\'s spec [2], validated against the test melodies he reports. The full planner had no open-source release; reimplementing it was a substantial chunk of the project.',
      },

      // ---------- References ----------
      {
        kind: 'heading',
        eyebrow: 'Key references',
        text: 'References',
      },
      {
        kind: 'references',
        items: [
          {
            id: '1',
            authors: 'Thickstun, J., Hall, D., Donahue, C., & Liang, P.',
            year: '2023',
            title: 'Anticipatory Music Transformer',
            venue: 'Transactions on Machine Learning Research',
            note: 'The generative core of our system — an autoregressive Transformer with anticipation control that lets the planner condition future generation.',
            url: 'https://arxiv.org/abs/2306.08620',
          },
          {
            id: '2',
            authors: 'Bretan, M.',
            year: '2017',
            title: 'Towards an Embodied Musical Mind: Generative Algorithms for Robotic Musicians',
            venue: 'PhD thesis, Georgia Institute of Technology — Chapter 3',
            note: 'Chapter 3 lays out the Viterbi path-planning formulation we reimplement for Shimon\'s arm assignment. No public source release; reimplemented from the thesis spec.',
            url: 'https://repository.gatech.edu/entities/publication/e02dccf1-712b-4940-9f88-ebf03f87aa54',
          },
        ],
      },
    ],
  },

  {
    id: 8,
    slug: 'gems',
    title: 'GEMS — Gesture Ensemble Music System',
    venue: 'Music Tech History & Repertoire final project · Co-author with Anthony Cammarota',
    shortTitle: 'GEMS',
    description:
      'Play along to an iReal Pro backing track and the band sounds exactly the same whether you\'re inspired or bored — the music plays at you, not with you. GEMS turns the soloist into a conductor: a Python tracker reads upper-body gesture through a single webcam and shapes three Max/MSP engines — chord, bass, drums — in real time. We present a generative accompaniment system that restores the conversational feedback loop that defines live ensemble performance.',
    tags: ['Max/MSP', 'Python', 'Computer Vision', 'Interactive Music'],
    period: '2025',
    category: 'Musical Interaction',
    github: 'https://github.com/Jamesprocode/GEMS',
    tileImage: '/projects/gems/bass-engine.png',
    body: [
      // ---------- Demo video ----------
      {
        kind: 'video',
        src: '/projects/gems/demo.mp4',
        caption: 'Quick demo — gesture-driven ensemble performance, single performer controlling chord, bass, and drum engines through upper-body movement.',
      },

      // ---------- System Design ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'System Design',
      },
      {
        kind: 'text',
        content:
          'GEMS is implemented in Max/MSP and runs three generative player engines (Chord, Bass, Drums) over a user-defined chord progression. Each engine has a stable preset pattern plus a one-bar variation triggered by gesture. The performer\'s upper body is tracked in real time with MediaPipe; upper-body motions activate/mute engines and introduce probabilistic fills that reset to the preset at the next bar boundary. MIDI output routes into Ableton Live, so timbre stays fully editable.',
      },
      {
        kind: 'heading',
        eyebrow: 'Section 2',
        text: 'Player Engines',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'The chord engine reads symbolic chord labels and emits voiced MIDI stacks that account for chord quality, inversion, and extensions, scheduled against a per-bar rhythmic template. The bass engine reduces each chord to a monophonic line of chord tones (root, third, fifth, seventh) in a low-register MIDI range. The drum engine runs independently of harmony from its own rhythm template, with probabilistic fills layered over a stable kick/snare/hi-hat groove.',
        image: {
          src: '/projects/gems/bass-engine.png',
          alt: 'Bass engine player patch in Max/MSP.',
          caption: 'Bass engine in Max — chord-tone sequencer over a per-bar rhythmic template, with gesture-triggered probabilistic variation.',
        },
      },

      // ---------- Gestural Control ----------
      {
        kind: 'heading',
        eyebrow: 'Section 3',
        text: 'Gestural Control',
      },
      {
        kind: 'sideBySide',
        imageSide: 'left',
        text:
          'A Python module reads the performer in real time via Google\'s MediaPipe pose-estimation, which tracks 32 skeletal landmarks from a standard webcam. GEMS subscribes to nine of them — the upper-body ring shown above — with the nose and the two wrists doing most of the work. Position data is streamed to Max/MSP over UDP. No wearables; a single webcam captures the gesture vocabulary, which keeps the system playable while the performer\'s hands remain mostly on their instrument.',
        image: {
          src: '/projects/gems/python-tracking.png',
          alt: 'Performer with MediaPipe skeletal landmarks overlaid during play.',
          caption: 'MediaPipe landmark tracking — single webcam, no wearables, performer mid-play.',
        },
      },
      {
        kind: 'heading',
        eyebrow: 'Section 4',
        text: 'Gesture-to-Music Mapping',
      },
      {
        kind: 'list',
        intro: 'Each tracked landmark maps to a structural musical decision rather than a low-level sound parameter:',
        items: [
          { label: 'Nose', body: 'Master switch — a downward, bow-like motion toggles overall playback on or off, mimicking a conductor\'s cue.' },
          { label: 'Right wrist (upper)', body: 'Toggle bass engine on/off.' },
          { label: 'Right wrist (lower)', body: 'Trigger a one-bar bass variation — probabilistic note-on plus pitch randomness across chord tones, resetting to the preset at the next downbeat.' },
          { label: 'Left wrist (upper)', body: 'Toggle chord engine comping on/off.' },
          { label: 'Left wrist (lower)', body: 'Trigger a one-bar chord-rhythm variation — probability-driven chord attacks, reverting to the default rhythm at the next bar.' },
        ],
      },

    ],
    links: [
      {
        label: 'Paper (PDF)',
        url: '/projects/gems/paper.pdf',
      },
    ],
  },

  {
    id: 3,
    slug: 'f0',
    title: 'Deep Salient Detection for F0 Estimation',
    venue: 'Audio Content Analysis class project · Co-author with Changda Ma',
    shortTitle: 'F0 Pitch Tracking',
    description:
      'Listening to a singer, your ear nails the pitch in milliseconds — but tell a computer to do the same and most models trip up on harmonics, vibrato, and breath noise. We replicate Bittner et al.\'s salience-based F0 estimation [1] on Harmonic CQT inputs and extend it with a head-to-head: a from-scratch CNN, a ResNet18 transfer-learned variant, and a rule-based autocorrelation baseline, all evaluated on the Vocadito vocal corpus to test which inductive biases actually help on spectral input.',
    tags: ['Deep Learning', 'CNN', 'MIR', 'Python'],
    period: 'Sep – Dec 2025',
    category: 'Music Information Retrieval',
    github: 'https://github.com/Jamesprocode/Deep-Salient-Detection-for-F0-Estimation',
    tileImage: '/projects/f0/icon.png',
    body: [

      // ---------- Methodology / Input ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'Model Architecture',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'The input representation is a Harmonic Constant-Q Transform (HCQT). Audio is resampled to 44.1 kHz; six CQTs are computed at harmonic scalings h ∈ {0.5, 1, 2, 3, 4, 5}, with fmin = C1 (~32.7 Hz), 6 octaves, 60 bins/octave, hop = 512. The CQTs are stacked into a 6 × 360 × T tensor — harmonics × frequency bins × time frames. Targets are binary salience maps Gaussian-blurred around the ground-truth F0 to stabilize training.',
        image: {
          src: '/projects/f0/icon.png',
          alt: 'HCQT input and Gaussian-blurred F0 salience target.',
          caption: 'HCQT input (top) + Gaussian-blurred F0 salience target (bottom).',
        },
      },
      {
        kind: 'text',
        content:
          'The primary model is SimpleNet: a fully-convolutional network with 3 stacked conv + BN + ReLU blocks, no pooling (preserving time–frequency resolution), and a final 1×1 conv that projects to a single-channel salience map. The transfer-learning variant uses an ImageNet-pretrained ResNet18 backbone, with the first conv adapted to accept the 6-channel HCQT input.',
      },
      {
        kind: 'list',
        intro:
          'Training uses two loss configurations. The hybrid combines BCE on logits with MSE on the sigmoid outputs:',
        items: [
          { label: 'BCE', body: 'Binary cross-entropy per time–frequency bin — sharpens peaks at the true F0.' },
          { label: 'BCE + MSE', body: 'Adds a small mean-squared-error term — smooths alignment to the Gaussian targets.' },
        ],
      },

      // ---------- Experiment Setup ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2',
        text: 'Experimental Setup',
      },
      {
        kind: 'text',
        content:
          'Models are trained on MedleyDB-Pitch (artist-independent split, ~20% held out for validation) with randomly-cropped 512-frame HCQT segments, batch size 8, Adam optimizer. Six configurations are compared:',
      },
      {
        kind: 'table',
        headers: ['ID', 'Backbone', 'Pretrained', 'Frozen', 'Loss', 'LR'],
        rows: [
          { cells: ['M1', 'SimpleNet', 'No', 'N/A', 'BCE', '1e−3'] },
          { cells: ['M2', 'SimpleNet', 'No', 'N/A', 'BCE + MSE', '1e−3'] },
          { cells: ['M3', 'ResNet-18', 'Yes', 'Yes', 'BCE', '1e−4'] },
          { cells: ['M4', 'ResNet-18', 'Yes', 'Yes', 'BCE + MSE', '1e−4'] },
          { cells: ['M5', 'ResNet-18', 'Yes', 'No', 'BCE', '1e−4'] },
          { cells: ['M6', 'ResNet-18', 'Yes', 'No', 'BCE + MSE', '1e−4'] },
        ],
        caption: 'Table 1 — Six model configurations spanning architecture, pretraining, freezing, and loss design.',
      },
      {
        kind: 'list',
        intro:
          'Final evaluation is on the Vocadito multilingual vocal dataset (unseen during training), using the standard mir_eval.melody metrics:',
        items: [
          { label: 'VR', body: 'Voicing Recall — fraction of frames with a voiced melody where the system correctly detects voicing.' },
          { label: 'VFA', body: 'Voicing False Alarm — fraction of unvoiced reference frames where the system incorrectly predicts voicing.' },
          { label: 'RPA', body: 'Raw Pitch Accuracy — fraction of voiced frames with F0 estimated within 50 cents of ground truth.' },
          { label: 'RCA', body: 'Raw Chroma Accuracy — RPA with octave errors folded into a single octave.' },
          { label: 'OA', body: 'Overall Accuracy — combined measure of correct pitch on voiced frames and correct voicing decisions on unvoiced frames. Primary score for system comparison.' },
        ],
      },

      // ---------- Results ----------
      {
        kind: 'heading',
        eyebrow: 'Section 3',
        text: 'Results',
      },
      {
        kind: 'table',
        headers: ['Model', 'VR ↑', 'VFA ↓', 'RPA ↑', 'RCA ↑', 'OA ↑'],
        rows: [
          { cells: ['Autocorrelation', '99.85', '70.12', '84.09', '84.72', '65.65'] },
          { cells: ['SimpleNet (BCE)', '74.92', '1.54', '72.71', '72.74', '81.58'], highlight: true },
          { cells: ['SimpleNet (BCE+MSE)', '72.18', '3.18', '69.47', '69.49', '78.95'] },
          { cells: ['ResNet18 (BCE Frozen)', '3.43', '10.30', '0.00', '0.15', '30.33'], divider: true },
          { cells: ['ResNet18 (BCE Unfrozen)', '55.03', '23.33', '12.93', '12.93', '34.81'] },
          { cells: ['ResNet18 (BCE+MSE Frozen)', '3.43', '10.32', '0.00', '0.15', '30.32'] },
          { cells: ['ResNet18 (BCE+MSE Unfrozen)', '54.85', '23.56', '13.01', '13.01', '34.78'] },
        ],
        caption: 'Table 2 — Melody extraction on Vocadito (%, mean). SimpleNet (BCE) is the top performer; ResNet18 transfer learning fails to bridge the domain gap.',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'SimpleNet produces a noisier-looking salience map but the right peaks land at the correct F0 bins, giving robust pitch accuracy after thresholding. The autocorrelation baseline detects voicing well (VR 99.85%) but has no mechanism to reject unvoiced frames — a 70% false-alarm rate that wrecks its overall accuracy.',
        image: {
          src: '/projects/f0/salience-simplenet.png',
          alt: 'F0 salience map from the SimpleNet model.',
          caption: 'SimpleNet salience — noisier visually, correct peaks at the true F0.',
        },
      },
      {
        kind: 'sideBySide',
        imageSide: 'left',
        text:
          'The ResNet18 transfer-learning variant predicts a near-empty salience map. The pretrained vision filters are tuned for translation-invariant features (an object looks the same anywhere in the image), but in a time–frequency plane the vertical axis is pitch — shifting a harmonic stack vertically changes the note. The architectural prior fights the task.',
        image: {
          src: '/projects/f0/salience-resnet.png',
          alt: 'F0 salience map from the ResNet18 transfer-learning model.',
          caption: 'ResNet18 salience — much weaker activation; pretrained filters do not transfer to spectral salience detection.',
        },
      },
      // ---------- Discussion ----------
      {
        kind: 'heading',
        eyebrow: 'Section 4',
        text: 'Discussion',
      },
      {
        kind: 'text',
        content:
          'The performance gap between SimpleNet (trained from scratch) and ResNet18 (transfer-learned) highlights a fundamental mismatch in applying computer-vision priors to audio. ImageNet-pretrained models learn translation-invariant features by design — useful for natural images where an object can appear anywhere, but actively wrong for a time–frequency representation where vertical position is pitch. Even unfrozen fine-tuning could not undo this inductive bias. The result: a smaller, domain-specific model outperforms a larger, general-purpose vision model for dense spectral prediction.',
      },

      // ---------- References ----------
      {
        kind: 'heading',
        eyebrow: 'Key references',
        text: 'References',
      },
      {
        kind: 'references',
        items: [
          {
            id: '1',
            authors: 'Bittner, R., McFee, B., Salamon, J., Li, P., & Bello, J. P.',
            year: '2017',
            title: 'Deep Salience Representations for F0 Estimation in Polyphonic Music',
            venue: 'Proceedings of the 18th International Society for Music Information Retrieval Conference (ISMIR), Suzhou, China, pp. 63–70',
            note: 'The salience-based F0 estimation architecture and training setup we replicate and extend. The HCQT input representation and the Gaussian-blurred salience target both come from this paper.',
            url: 'https://archives.ismir.net/ismir2017/paper/000085.pdf',
          },
        ],
      },
    ],
    links: [
      {
        label: 'Paper (PDF)',
        url: '/projects/f0/paper.pdf',
      },
    ],
  },

  {
    id: 4,
    slug: 'hmm-patterns',
    title: 'Patterns for Prediction',
    venue: 'Audio Content Analysis class project · Co-author with Anthony Cammarota and Ling Qi',
    shortTitle: 'Patterns for Prediction',
    description:
      'Modern transformer architectures handle MIDI continuation well — give Music Transformer or the Anticipatory Music Transformer a few bars and they produce stylistically coherent symbolic music. Audio continuation, with no symbolic step in between, is still largely unexplored. This project tackles the [MIREX Patterns for Prediction task](https://music-ir.org/mirex/wiki/2021:Patterns_for_Prediction) end-to-end in audio: three modeling iterations push from raw spectrograms through clustered spectrograms to clustered musical features driving a variable-order Hidden Markov Model — the first configuration that produces musically interpretable continuations.',
    tags: ['Audio ML', 'HMM', 'DSP', 'Python'],
    period: 'Sep – Dec 2025',
    category: 'Music Information Retrieval',
    github: 'https://github.com/Jamesprocode/Pattern-for-Prediction-audio-to-audio',
    tileImage: '/projects/hmm-patterns/icon.png',
    body: [
      // ---------- §1 Data ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'Data',
      },
      {
        kind: 'text',
        content:
          'PPDD-Jul2018, the [MIREX Patterns for Prediction development set](https://music-ir.org/mirex/wiki/2021:Patterns_for_Prediction) derived from the Lakh MIDI corpus. We use the small monophonic subset. Because the original primes have varying tempos, every file is time-normalized to 120 BPM, synthesized at 22,050 Hz with a fixed soundfont, then segmented into 16th-note slices so every observation has the same shape. After filtering, 75 valid primes remain — 60 training, 15 test.',
      },

      // ---------- §2 Pipeline ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2',
        text: 'Pipeline & Modeling Variants',
      },
      {
        kind: 'text',
        content:
          'Three modeling attempts share the same pre-processing and post-processing scaffolding. They differ in what gets clustered (spectrogram pixels vs. musical features) and what HMM is trained on it (first-order Gaussian, first-order Categorical, or our variable-order implementation). Earlier attempts produce noise-like or jittery output; only Attempt 3 yields musically interpretable continuations.',
      },
      {
        kind: 'image',
        src: '/projects/hmm-patterns/pipeline.png',
        alt: 'Full audio-to-audio HMM pipeline with the three modeling attempts marked A, B, C.',
        caption: 'Full pipeline. Pre-processing (tempo-normalize, slice at 16th notes) feeds three branches: (A) raw spectrograms → first-order Gaussian HMM; (B) clustered spectrograms → first-order Categorical HMM; (C, best) clustered musical features → variable-order HMM, decoded by sampling an exemplar slice per cluster.',
      },
      {
        kind: 'list',
        items: [
          { label: 'Attempt 1', body: 'PCA-reduced raw spectrograms (80-D → 20-D) + first-order Gaussian HMM. Output: noise. Pitch and rhythm are not recoverable from the result.' },
          { label: 'Attempt 2', body: 'k-means clustered spectrograms + first-order Categorical HMM. Cluster IDs are decoded back to spectrograms via cluster centroids. Output: sporadic melodic fragments, but jittery and low-fidelity — first-order context is too short to capture musical structure.' },
        ],
      },
      {
        kind: 'list',
        variant: 'highlight',
        intro: 'Best configuration — Attempt 3:',
        items: [
          { label: 'Features', body: 'Musical features (chroma, RMS energy, spectral flux/centroid) extracted from each slice, then k-means clustered (K = 500) so each cluster represents a musically coherent observation. Spectrograms are reconstructed by sampling the cluster\'s nearest exemplar slice — not its centroid — to preserve spectral detail.' },
          { label: 'Model', body: 'Variable-order HMM (custom implementation, since hmmlearn supports only first-order). Training stores context distributions up to 50 steps long, plus all shorter contexts; at generation, it tries the longest available context and falls back progressively. Generation is biased toward patterns from the local prime sequence, so continuations favor patterns specific to each test piece rather than the training-corpus average.' },
        ],
      },

      // ---------- §3 Evaluation ----------
      {
        kind: 'heading',
        eyebrow: 'Section 3',
        text: 'Evaluation',
      },
      {
        kind: 'list',
        intro: 'Two MIREX explicit-task metrics, both computed after transcribing the generated audio back to symbolic onsets and pitches with librosa.yin:',
        items: [
          { label: 'Cardinality Score', body: 'How well the predicted continuation matches the rhythmic and structural pattern of the ground truth. Note events in the prediction are aligned to ground-truth events under the best temporal/pitch shift. F1-like behavior — rewards correct events, penalizes missing or wrong ones.' },
          { label: 'Pitch Score', body: 'How closely the predicted continuation matches the melodic content of the ground truth, regardless of rhythm. Both predictions and ground truth are converted to pitch-class histograms (mod 12, so a correct key in a different octave is not penalized); the score is the histogram overlap.' },
        ],
      },

      // ---------- §4 Results ----------
      {
        kind: 'heading',
        eyebrow: 'Section 4',
        text: 'Results',
      },
      {
        kind: 'table',
        headers: ['Metric', 'Attempt 3 (ours)', 'MIREX Markov (sym. ref.)'],
        rows: [
          { cells: ['Cardinality Score', '0.263 ± 0.208', '≈ 0.27 – 0.30'] },
          { cells: ['Pitch Score', '0.429 ± 0.196', '≈ 0.45 – 0.50'], highlight: true },
        ],
        caption: 'Table I — Attempt 3 vs. MIREX symbolic Markov baseline on the PPDD test set (explicit task). The audio-based HMM lands just below the symbolic reference, with high variance across primes.',
      },

      // ---------- §5 Discussion ----------
      {
        kind: 'heading',
        eyebrow: 'Section 5',
        text: 'Discussion',
      },
      {
        kind: 'text',
        content:
          'Two structural limitations explain most of the gap to symbolic baselines. First, generating audio by concatenating 16th-note slices produces discontinuities at slice boundaries, and the fixed grid biases the output toward staccato events — sustained notes and complex phrasing don\'t reconstruct cleanly. Second, the MIREX Cardinality and Pitch Scores are symbolic metrics that require transcribing the generated audio back to MIDI before scoring. Standard audio-to-MIDI assumes high-fidelity input; our outputs carry slicing artifacts, so the transcription step itself introduces error and the metric never sees the actual acoustic detail we were trying to model in the first place. Future evaluation of audio-to-audio systems probably needs perceptual metrics computed directly on the audio, not symbolic proxies.',
      },
    ],
    links: [
      {
        label: 'Paper (PDF)',
        url: '/projects/hmm-patterns/report.pdf',
      },
      {
        label: 'Slide deck (PDF)',
        url: '/projects/hmm-patterns/paper.pdf',
      },
    ],
  },

  {
    id: 5,
    slug: 'super-awesome',
    title: 'Super Awesome Vocal Chain',
    venue: 'Audio Software Engineering final project · Group with A. Branchek, R. Collado, B. Deng, JD Harris',
    shortTitle: 'Super Awesome',
    description:
      'Mixing a vocal usually means stacking five plugins from five different companies, each with their own UI conventions, just to get a basic chain on the bus. Super Awesome is a single-window vocal chain — parametric EQ, compressor, noise gate, de-esser — that ships as VST3 and standalone. The interesting part isn\'t the DSP; it\'s the architecture: a React app embedded inside JUCE via WebView, so the interface evolves at browser speed without ever touching the audio thread.',
    tags: ['C++', 'JUCE', 'React', 'DSP', 'Audio Plugin'],
    period: 'Aug – Dec 2025',
    category: 'Music Software',
    github: 'https://github.com/Jamesprocode/Super-Awesome-Final-Project',
    tileImage: '/projects/super-awesome/ui-screenshot.png',
    body: [
      {
        kind: 'cta',
        text: 'The project has its own site with full UI walkthrough, DSP architecture details, and demo videos.',
        label: 'Visit the project site',
        url: 'https://super-awesome.vercel.app/',
      },
    ],
  },

  {
    id: 9,
    slug: 'harmonic-divorce',
    title: 'Chord Tone or Harmonic-Bass Divorce? An Enactive Approach to Hearing Pedals in Popular Music',
    venue: 'Independent research with Stephen Hudson · Music Theory Online · Published 2025',
    shortTitle: 'Pedals in Popular Music',
    description:
      'Listen to the intro of "You Keep Me Hangin\' On" — a single high E♭ rings under a sequence of moving chords. Is that E♭ a chord tone in every chord above it, or has it broken away from the harmony into its own voice? In popular music both readings hold at once: the ear has agency. We propose an enactive theory of pedals that names this plurality, with a multiparameter framework and two new categories — the sentimental pedal and the cinematic pedal — for moments that traditional theory has labeled paradoxical.',
    tags: ['Music Theory', 'Music Cognition', 'Popular Music'],
    period: 'Published 2025',
    category: 'Music Theory',
    tileImage: '/projects/rock-harmony/entropy-by-year.png',
    body: [
      {
        kind: 'cta',
        text: 'Read the full paper on Music Theory Online.',
        label: 'Read the paper',
        url: 'https://www.mtosmt.org/issues/mto.25.31.4/mto.25.31.4.hudson_wang.html',
      },
    ],
    links: [
      {
        label: 'Music Theory Online',
        url: 'https://www.mtosmt.org/issues/mto.25.31.4/mto.25.31.4.hudson_wang.html',
      },
    ],
  },

  {
    id: 6,
    slug: 'rock-harmony',
    title: 'Tracing the Evolution of Popular Music Harmony',
    venue: 'Occidental Music Department Senior Comprehensive Project · 2024',
    shortTitle: 'Rock Harmony',
    description:
      'Listen to a 1965 Beatles tune next to a 2018 pop hit and something feels harmonically different — but is popular music actually getting simpler, or does it just feel that way? We apply Shannon entropy to chord progressions across the McGill Billboard corpus, asking whether harmonic complexity has trended upward, downward, or oscillated by genre cycle. The published version, "Harmonic Divorce or Not?", appeared in Music Theory Online.',
    tags: ['Computational Musicology', 'Python', 'Statistics'],
    period: 'Jun – Dec 2024',
    category: 'Music Theory',
    github: 'https://github.com/Jamesprocode/Tracing-the-Evolution-of-Rock-and-Popular-Music-Harmony--A-Computational-Study-Using-Shannon-Entropy',
    tileImage: '/projects/rock-harmony/entropy-by-year.png',
    body: [
      // ---------- §1 Dataset ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'Dataset',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'The McGill Billboard Project [1]: expert chord annotations for 890 Billboard-charting songs across five decades, with chord progressions, section labels (verse / chorus / bridge / outro), meter, and key. Each song is stored as plain text with timestamps; sections and chords are extracted directly from those files. Earlier corpus work — most notably De Clercq & Temperley [2] — used this kind of data to characterize chord-to-chord relationships; we use it to ask a different question.',
        image: {
          src: '/projects/rock-harmony/dataset-sample.png',
          alt: 'Sample annotation from the McGill Billboard dataset — "You\'ve Got a Friend".',
          caption: 'Sample annotation — timestamps, section labels, and chord progressions per line.',
        },
      },

      // ---------- §2 Method ----------
      {
        kind: 'heading',
        eyebrow: 'Section 2',
        text: 'Method',
      },
      {
        kind: 'text',
        content:
          'Shannon entropy over each song\'s chord-class distribution gives a single number for harmonic unpredictability — higher when many chords are used in roughly equal proportion, lower when a few dominate. We compute it both at the whole-song level (for the yearly arc) and per section (verse / chorus / bridge), then track how the distribution shifts over decades.',
      },

      // ---------- §3 Results ----------
      {
        kind: 'heading',
        eyebrow: 'Section 3',
        text: 'Results',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'Mean entropy by year shows a 1950s–60s baseline, a 1970s climb as modal and extended harmony entered the popular vocabulary, a peak around the 1980s, and a decline through the 1990s–2000s. Not a monotonic "harmonic divorce" from common-practice tonality — an oscillation tied to genre cycles.',
        image: {
          src: '/projects/rock-harmony/entropy-by-year.png',
          alt: 'Mean harmonic entropy by year, 1950s–2000s.',
          caption: 'Mean harmonic entropy by year — peak in the 1980s, decline through 2000s.',
        },
      },
      {
        kind: 'sideBySide',
        imageSide: 'left',
        text:
          'By section, verses and choruses sit at low entropy — a tight palette holds the song\'s identity — and bridges spike. This pattern is stable across decades, so the harmonic role of each formal section appears robust to stylistic change.',
        image: {
          src: '/projects/rock-harmony/entropy-by-section.png',
          alt: 'Mean entropy by song section.',
          caption: 'Mean entropy by song section — verses and choruses tight, bridges spike.',
        },
      },

      // ---------- §4 Discussion ----------
      {
        kind: 'heading',
        eyebrow: 'Section 4',
        text: 'Discussion',
      },
      {
        kind: 'text',
        content:
          'From this corpus, popular music has not gotten harmonically simpler — the 1980s sit at peak entropy with lower-entropy decades on either side. Whether that holds beyond the McGill Billboard set is a separate question; the Billboard Hot 100 selects for commercial popularity, and a stronger conclusion would need additional corpora. What this study adds is one piece of evidence against the one-way-decline narrative, plus a section-level observation that\'s stable across decades: the bridge does most of the harmonic risk-taking while verses and choruses stay tight.',
      },

      // ---------- References ----------
      {
        kind: 'heading',
        eyebrow: 'Key references',
        text: 'References',
      },
      {
        kind: 'references',
        items: [
          {
            id: '1',
            authors: 'Burgoyne, J. A., Wild, J., & Fujinaga, I.',
            year: '2011',
            title: 'An Expert Ground Truth Set for Audio Chord Recognition and Music Analysis',
            venue: 'Proceedings of the 12th International Society for Music Information Retrieval Conference (ISMIR), Miami, FL, pp. 633–638',
            note: 'The McGill Billboard Project — 890 expert chord annotations of Billboard-charting songs, the corpus this study runs on.',
            url: 'https://ismir2011.ismir.net/papers/OS8-1.pdf',
          },
          {
            id: '2',
            authors: 'De Clercq, T., & Temperley, D.',
            year: '2011',
            title: 'A Corpus Analysis of Rock Music',
            venue: 'Popular Music, 30(1), 47–70',
            note: 'Foundational corpus study of rock harmony — characterizes chord-to-chord transition patterns. This project builds on the same data but asks an evolution-over-time question rather than a static one.',
            url: 'https://doi.org/10.1017/S026114301000067X',
          },
        ],
      },
    ],
    links: [
      {
        label: 'Music Theory Online — Harmonic Divorce or Not?',
        url: 'https://mtosmt.org/',
      },
    ],
  },

  {
    id: 7,
    slug: 'stem-separation',
    title: 'Reference-Free Evaluation Framework for Stem Separation',
    venue: 'Occidental CS Department Senior Comprehensive Project · 2024',
    shortTitle: 'Stem Separation',
    description:
      'Pull a vocal stem out of a song with any of the popular AI separation tools and you\'ll hear the result — but how do you measure its quality when there\'s no clean ground truth outside an academic benchmark? We propose two reference-free evaluation metrics: the Frequency Isolation Score, checking how well a stem\'s fundamental and harmonics survive separation, and the Dynamic Stability Score, measuring whether the stem\'s energy flickers in places it shouldn\'t. Built so that consumer-side and AI-generated stems can finally be assessed in the wild.',
    tags: ['Audio DSP', 'Evaluation Metrics', 'Python', 'Research'],
    period: 'Jun – Dec 2024',
    category: 'Music Information Retrieval',
    github: 'https://github.com/Jamesprocode/A-Reference-Free-Framework-for-Stem-Separation-Evaluation',
    tileImage: '/projects/stem-separation/poster.jpg',
    body: [

      // ---------- Introduction ----------
      {
        kind: 'heading',
        eyebrow: 'Section 1',
        text: 'Introduction',
      },
      {
        kind: 'text',
        content:
          'Standard separation metrics from Vincent et al. (2006) — SDR, SIR, SAR — require clean ground-truth stems. That limits them to academic benchmarks (MUSDB18, MUSDB18-HQ) where stems exist by construction, and rules out evaluation of consumer-facing separation tools or AI-generated stems where no reference exists. They also focus on artifact and interference suppression, ignoring whether the separated stem preserves the harmonic structure and dynamic profile of the source. This study introduces two reference-free metrics that complement SAR by measuring those preserved aspects directly.',
      },

      // ---------- Methods ----------
      {
        kind: 'heading',
        eyebrow: 'Section 4',
        text: 'Methods',
      },
      {
        kind: 'list',
        variant: 'highlight',
        intro: 'New contribution — two reference-free metrics, both built from STFT magnitudes of mix and stem:',
        items: [
          { label: 'FIS', body: 'Frequency Isolation Score — checks whether the stem\'s fundamental frequency and its harmonics (integer multiples of f0, up to 20 kHz) are preserved in the mix. Fundamental presence contributes a fixed 40 points; harmonic presence contributes up to 60 points, normalized by harmonic count. Range 0–100.' },
          { label: 'DSS', body: 'Dynamic Stability Score — DSS = μ_RMS / (σ_RMS + ε), measuring how stable the stem\'s RMS energy is across active frames. A spectral-flux penalty (rate of change between consecutive STFT frames) is subtracted to discourage stems that flicker as the separator drops in and out. Set to 0 for inherently dynamic instruments like drums to avoid unfair penalty.' },
        ],
      },
      {
        kind: 'text',
        content:
          'Both metrics rely only on the mix and the separated stem — no ground-truth reference required — making them applicable to scenarios where references are unavailable (consumer software, AI-generated stems, live-recorded material).',
      },

      // ---------- Evaluation ----------
      {
        kind: 'heading',
        eyebrow: 'Section 5',
        text: 'Evaluation',
      },
      {
        kind: 'text',
        content:
          'Tracks from MUSDB18-HQ (uncompressed) were separated into four stems (vocals, drums, bass, other) using Demucs (time-domain) and Open-Unmix (frequency-domain). SIR scored near-perfect across the dataset, collapsing SDR and SAR to the same value, so the comparison centers on SAR vs. FIS vs. DSS. Two statistics: Pearson correlation between SAR and each proposed metric, and a multiple linear regression modeling SAR as a function of FIS and DSS.',
      },

      // ---------- Results ----------
      {
        kind: 'heading',
        eyebrow: 'Section 6',
        text: 'Results',
      },
      {
        kind: 'sideBySide',
        imageSide: 'right',
        text:
          'Pearson correlation between SAR and the proposed metrics is weak: SAR vs. FIS r = −0.17, SAR vs. DSS r = +0.18. The weakness is the point — SAR primarily measures artifact suppression, FIS measures frequency-domain isolation, DSS measures temporal stability. They are not redundant proxies for one another; they capture different dimensions of separation quality.',
        image: {
          src: '/projects/stem-separation/pearson-correlation.png',
          alt: 'Pearson correlation matrix between SAR, FIS, and DSS.',
          caption: 'Pearson correlation — SAR vs. FIS (r = −0.17), SAR vs. DSS (r = +0.18). The three metrics measure distinct aspects of separation quality.',
        },
      },
      {
        kind: 'table',
        headers: ['Statistic', 'Value'],
        rows: [
          { cells: ['R²', '0.055'] },
          { cells: ['Adjusted R²', '0.043'] },
          { cells: ['F-statistic', '4.46'] },
          { cells: ['p-value', '0.013'], highlight: true },
          { cells: ['Intercept (β0)', '8.68'], divider: true },
          { cells: ['Coefficient (FIS)', '−0.0488'] },
          { cells: ['Coefficient (DSS)', '+0.0287'] },
        ],
        caption: 'Multiple regression — SAR ≈ β0 + βFIS·FIS + βDSS·DSS. Low R² (5.5%) but jointly statistically significant (p < 0.05).',
      },
      // ---------- Discussion ----------
      {
        kind: 'heading',
        eyebrow: 'Section 6.3',
        text: 'Discussion',
      },
      {
        kind: 'text',
        content:
          'The headline result is that FIS and DSS do not duplicate SAR — and that\'s the right outcome. A reference-free metric that closely tracked SAR would just be a noisier SAR. FIS and DSS measure complementary signal-processing properties that SAR misses entirely. The low R² means SAR is influenced by additional factors not captured by these two metrics, which points to a multi-dimensional evaluation framework rather than any single number.',
      },

      // ---------- Poster ----------
      {
        kind: 'heading',
        eyebrow: 'Summary',
        text: 'Poster',
      },
      {
        kind: 'image',
        src: '/projects/stem-separation/poster.jpg',
        alt: 'Project poster summarizing the framework and results.',
        caption: 'Poster — one-page summary of the framework, metrics, and results.',
      },
    ],
    links: [
      {
        label: 'Full thesis PDF',
        url: '/projects/stem-separation/paper.pdf',
      },
    ],
  },
];

export default projects;
