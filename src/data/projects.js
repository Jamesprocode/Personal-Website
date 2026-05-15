const projects = [
  {
    id: 1,
    slug: 'omr',
    title: 'OMR for Jazz Lead Sheets',
    shortTitle: 'OMR for Jazz',
    description: 'Extending the Sheet Music Transformer to full-page jazz lead sheets through a jazz-aware tokenizer, a stave-stacking strategy, and curriculum learning on the JazzMus corpus.',
    tags: ['Deep Learning', 'Transformers', 'OMR', 'Python'],
    period: 'Aug 2025 – present',
    category: 'AI / Machine Learning',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/omr/pipeline-output.jpg',
    body: [
      {
        kind: 'image',
        src: '/projects/omr/poster.jpg',
        alt: 'ISMIR project poster summarizing the system and results.',
        caption: 'ISMIR poster — one-page summary of architecture, training, and results.',
      },
      {
        kind: 'text',
        content:
          'Current optical music recognition (OMR) models are trained on engraved classical scores and degrade sharply on jazz lead sheets, where chord symbols, slash notation, cue notes, and dense ornamentation lie outside the training distribution. This project adapts the Sheet Music Transformer (SMT) of Ríos-Vila et al. (2024) to recognize full-page jazz lead sheets end-to-end.',
      },
      {
        kind: 'image',
        src: '/projects/omr/sample-lead-sheet.jpg',
        alt: 'A typical jazz lead sheet from the JazzMus corpus.',
        caption: 'A typical input from the JazzMus corpus.',
      },
      {
        kind: 'text',
        content:
          'The first modification is at the vocabulary layer. SMT\'s default tokenizer treats chord symbols (e.g. "Cmaj7", "F#m7b5") as ASCII strings, which produces a heavy long tail. We extend the tokenizer to treat each chord symbol as a single first-class token, collapsing the long tail into a vocabulary the model can generalize over.',
      },
      {
        kind: 'image',
        src: '/projects/omr/architecture.jpg',
        alt: 'Sheet Music Transformer encoder-decoder architecture.',
        caption: 'Sheet Music Transformer — convolutional encoder + autoregressive decoder, with the extended jazz vocabulary.',
      },
      {
        kind: 'text',
        content:
          'The second modification handles multi-stave pages. SMT was originally trained on single staves; lead sheets have several systems stacked vertically with cross-stave dependencies (chord symbols, slurs, repeats). We preprocess each page into a stack of n cropped staves and concatenate them as one elongated input so cross-stave context survives into the encoder.',
      },
      {
        kind: 'image',
        src: '/projects/omr/stacking-strategy.png',
        alt: 'Diagram of the stave-stacking pre-processing strategy.',
        caption: 'Stacking strategy — pages split into n stave crops, concatenated as a single input.',
      },
      {
        kind: 'text',
        content:
          'Training uses a curriculum schedule on JazzMus, advancing from plain heads to fully-ornamented charts. The model is fine-tuned from the SMT classical checkpoint rather than trained from scratch, which substantially reduces both training time and the volume of jazz-specific data required to converge.',
      },
      {
        kind: 'text',
        content:
          'At inference the model decodes the page token-by-token; the recognized tokens are then re-laid against the input score so errors are visible spatially rather than only as aggregate numbers.',
      },
      {
        kind: 'image',
        src: '/projects/omr/pipeline-output.jpg',
        alt: 'Inference pipeline output: predicted score overlaid on input lead sheet.',
        caption: 'Pipeline output — recognized score (right) re-laid against the input lead sheet (left).',
      },
      {
        kind: 'text',
        content:
          'We report per-n token accuracy on the JazzMus validation set. The curriculum schedule and the stacking strategy together improve accuracy across all n, with the largest gains at long-context tokens (n ≥ 5) where cross-stave dependencies dominate.',
      },
      {
        kind: 'image',
        src: '/projects/omr/accuracy.png',
        alt: 'Per-n token accuracy chart on the JazzMus validation set.',
        caption: 'Per-n token accuracy on the JazzMus validation set.',
      },
      {
        kind: 'text',
        content:
          'The work was submitted to ISMIR. The paper is linked below.',
      },
    ],
    links: [
      {
        label: 'ISMIR paper (PDF)',
        url: '/projects/omr/paper.pdf',
      },
    ],
  },

  {
    id: 2,
    slug: 'amt',
    title: 'Anticipatory Music Transformer for Shimon',
    shortTitle: 'AMT × Shimon',
    description: 'Coupling an Anticipatory Music Transformer with a Viterbi path planner to generate physically feasible music for a four-armed robotic marimba player.',
    tags: ['Music Transformer', 'Viterbi', 'Robotics', 'Python'],
    period: 'Oct 2025 – present',
    category: 'AI / Machine Learning',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/amt/shimon-detail.jpg',
    body: [
      {
        kind: 'image',
        src: '/projects/amt/shimon-detail.jpg',
        alt: 'Shimon, the four-armed robotic marimba player at Georgia Tech.',
        caption: 'Shimon — four arms, one shared rail, ~36 marimba bars.',
      },
      {
        kind: 'text',
        content:
          'Shimon is a four-armed robotic marimba player at Georgia Tech\'s Center for Music Technology. The arms share a single horizontal rail and cannot cross, each arm is wider than a single marimba bar, and rail movement is bounded by a ~130 ms/half-step speed limit. Any musical line the robot plays must be physically feasible under those constraints.',
      },
      {
        kind: 'text',
        content:
          'The system runs in two coupled stages. Stage one is generation: an Anticipatory Music Transformer (Thickstun et al., 2023), pretrained on Lakh MIDI, samples candidate musical lines token-by-token in event-based MIDI. Stage two is planning: a Viterbi path planner — reimplemented from Mason Bretan\'s 2017 PhD thesis (no source release exists) — assigns each generated note to the arm that can play it without violating speed or collision constraints.',
      },
      {
        kind: 'image',
        src: '/projects/amt/shimon-icon.jpg',
        alt: 'Close-up of Shimon\'s arm and mallet over the marimba bars.',
        caption: 'Each arm carries a single mallet; arms cannot cross, and rail movement is speed-capped.',
      },
      {
        kind: 'text',
        content:
          'The planner formulates arm assignment as a shortest-path problem over a trellis whose states are (note, arm) pairs. Edge costs encode physical reality: long travel = high cost, arm crossings = ∞, fast moves within the speed limit = low cost. The cost function follows Bretan\'s spec, validated against the test melodies he reports.',
      },
      {
        kind: 'text',
        content:
          'The novel component is the coupling: the planner\'s cost is fed back into the AMT\'s sampling step as a constrained-decoding signal, so infeasible choices are discouraged before they are ever emitted. The result is an online pipeline that generates Shimon-feasible music end-to-end, rather than rejection-sampling on top of an unconstrained generator.',
      },
    ],
  },

  {
    id: 3,
    slug: 'f0',
    title: 'Deep Salient Detection for F0 Estimation',
    shortTitle: 'F0 Pitch Tracking',
    description: 'CNN-based F0 estimation from Harmonic Constant-Q Transform inputs, comparing a from-scratch FCN against a ResNet18 transfer-learned variant on the Vocadito vocal corpus.',
    tags: ['Deep Learning', 'CNN', 'MIR', 'Python'],
    period: 'Sep – Dec 2025',
    category: 'AI / Machine Learning',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/f0/icon.png',
    body: [
      {
        kind: 'text',
        content:
          'Most deep pitch trackers operate on the mel spectrogram, which smears the harmonic series of a sung note across the time-frequency plane. The Harmonic Constant-Q Transform (HCQT) stacks several CQTs at integer pitch multiples, so the fundamental and its harmonics align as a fixed spatial pattern across input channels. This project compares two CNN architectures that take an HCQT in and produce an F0 salience map out.',
      },
      {
        kind: 'audio',
        src: '/projects/f0/vocal-sample.mp3',
        caption: 'Vocadito #19 — the evaluation clip behind both salience maps below.',
      },
      {
        kind: 'text',
        content:
          'The first architecture is a fully-convolutional CNN with four stacked dilated-conv blocks, trained from scratch. The second is a ResNet18 backbone (pretrained on ImageNet), with its first conv layer adapted to accept the HCQT\'s six-channel input, fine-tuned via transfer learning. Both models output a salience map across pitch over time.',
      },
      {
        kind: 'image',
        src: '/projects/f0/salience-resnet.png',
        alt: 'F0 salience map predicted by the ResNet18 transfer-learning model.',
        caption: 'ResNet18 + hybrid loss — sharp peaks at the true F0, low off-pitch background.',
      },
      {
        kind: 'image',
        src: '/projects/f0/salience-simplenet.png',
        alt: 'F0 salience map from the SimpleNet baseline.',
        caption: 'SimpleNet (FCN trained from scratch) — noisier salience, comparable accuracy after thresholding.',
      },
      {
        kind: 'text',
        content:
          'Training is supervised with a hybrid loss: a BCE term sharpens peaks at the true F0 locations, an MSE term suppresses the off-pitch background. Component weights (0.7 BCE / 0.3 MSE) were swept on a validation split.',
      },
      {
        kind: 'image',
        src: '/projects/f0/loss-curve.png',
        alt: 'Training loss curve for the ResNet hybrid loss model.',
        caption: 'Training curve — ResNet18, hybrid loss, 30 epochs, lr 1e-4.',
      },
      {
        kind: 'text',
        content:
          'At inference, the salience map is reduced to a single F0 trajectory via per-frame argmax and a Viterbi smoother that penalizes large jumps. Final accuracy is evaluated on the Vocadito multilingual vocal dataset against the autocorrelation baseline that ships with the assignment.',
      },
    ],
  },

  {
    id: 4,
    slug: 'hmm-patterns',
    title: 'Audio-to-Audio Patterns for Prediction',
    shortTitle: 'HMM Continuation',
    description: 'End-to-end audio-to-audio musical continuation using a Gaussian HMM over PCA-reduced mel-spectrogram observations at 16th-note resolution, with Griffin-Lim resynthesis.',
    tags: ['Audio ML', 'HMM', 'DSP', 'Python'],
    period: 'Sep – Dec 2025',
    category: 'AI / Machine Learning',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/hmm-patterns/icon.png',
    body: [
      {
        kind: 'text',
        content:
          'The MIREX audio-to-audio pattern prediction task takes a short audio excerpt and asks for the next few seconds of audio that follow it. This project is an end-to-end pipeline for that task: raw MIDI through tempo normalization, synthesis, feature extraction, HMM modeling, and Griffin-Lim phase reconstruction — with no symbolic representation in the middle.',
      },
      {
        kind: 'text',
        content:
          'Training data comes from the PPDD-Jul2018 corpus (100 prime/continuation MIDI pairs) with μ = 117 BPM, σ = 31. To remove tempo as a confound we normalize every file to 120 BPM by scaling note onsets and durations by 120 / original_bpm, then render to 22050 Hz WAV via FluidSynth. After tempo verification 75 of the 100 files pass.',
      },
      {
        kind: 'text',
        content:
          'Observations are taken at 16th-note resolution. Beat tracking (librosa) gives the downbeats; each beat is subdivided into four 16th-note windows; each window becomes an 80-bin mel spectrogram × 10 time steps = 800-dimensional vector, normalized to [0, 1] in dB space.',
      },
      {
        kind: 'text',
        content:
          'PCA is fit on the training set (12,848 observations) and projects each 800-D vector down to 20 components. Variance retained: 89.4%, dimensionality reduced by 97.5%.',
      },
      {
        kind: 'text',
        content:
          'The model is a Gaussian HMM with 10 hidden states, trained with Expectation-Maximization on the 20-D PCA features. To generate a continuation: the prime audio passes through the same feature pipeline, Viterbi decodes the current state, and the next states are sampled from the conditional distribution. Each sampled state is inverse-PCA\'d back to an 80×10 mel spectrogram, and Griffin-Lim reconstructs the phase to produce the output audio.',
      },
      {
        kind: 'text',
        content:
          'Evaluation uses the MIREX scoring scripts on a held-out 15-file test set, measuring pitch and cardinality accuracy against the ground-truth continuation MIDI.',
      },
    ],
    links: [
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
    shortTitle: 'Super Awesome',
    description: 'A C++ / JUCE vocal-chain plugin with a React-based UI bridged through a WebView. Group final for MUSI 6106 Audio Software Engineering at Georgia Tech.',
    tags: ['C++', 'JUCE', 'React', 'DSP', 'Audio Plugin'],
    period: 'Aug – Dec 2025',
    category: 'Music Software',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/super-awesome/ui-screenshot.png',
    body: [
      {
        kind: 'text',
        content:
          'A single-window vocal-chain plugin — parametric EQ, dynamic compressor, noise gate, de-esser — built as the MUSI 6106 (Audio Software Engineering) group final at Georgia Tech with Angela Branchek, Rafael Collado, Binyue Deng, and JD Harris. Ships as both VST3 and standalone.',
      },
      {
        kind: 'image',
        src: '/projects/super-awesome/ui-screenshot.png',
        alt: 'Super Awesome Vocal Chain plugin UI as shipped.',
        caption: 'The shipped plugin UI — full vocal chain on one screen, macro mapping panel below.',
      },
      {
        kind: 'text',
        content:
          'DSP is written in C++ on the JUCE framework. Each processor is implemented as its own AudioProcessor and can be reordered in the chain at runtime. The compressor and de-esser share a feedforward sidechain detector so their gain-reduction behavior stays coherent. Filter sections are biquad cascades with audio-thread parameter smoothing.',
      },
      {
        kind: 'text',
        content:
          'The UI is built as a React application served by Vite and embedded in the plugin via JUCE\'s WebView component, with a thin C++ ↔ JS bridge for parameter sync. This decouples interface iteration from the audio thread: design changes happen in a browser at React-fast speeds, and are bound to the plugin only after layout is final.',
      },
      {
        kind: 'image',
        src: '/projects/super-awesome/ui-diagram.png',
        alt: 'UI architecture diagram showing the React/JUCE/DSP split.',
        caption: 'UI architecture — React app, JUCE WebView bridge, DSP processors.',
      },
      {
        kind: 'text',
        content:
          'Every interactive component on screen (knobs, meters, the EQ frequency-response curve, the macro mapping view, the saturation-type selector) was written from scratch as a React component rather than pulled from a UI kit, keeping the visual identity coherent and the surface lightweight.',
      },
    ],
  },

  {
    id: 6,
    slug: 'rock-harmony',
    title: 'Rock Harmony Evolution',
    shortTitle: 'Rock Harmony',
    description: 'A computational musicology study of 890 rock songs (1958–2020), using Shannon entropy on chord-transition distributions as a measure of harmonic complexity. Published in Music Theory Online.',
    tags: ['Computational Musicology', 'Python', 'Statistics'],
    period: 'Jun – Dec 2024',
    category: 'Research',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/rock-harmony/entropy-by-year.png',
    body: [
      {
        kind: 'text',
        content:
          'Senior music thesis at Occidental College, published in Music Theory Online as "Harmonic Divorce or Not?". The study asks whether the harmonic language of rock music has measurably increased or decreased in complexity between 1958 and 2020.',
      },
      {
        kind: 'text',
        content:
          'The corpus is the McGill Billboard dataset: 890 expert-annotated chord transcriptions of Billboard-charting rock songs across the period. Each progression is treated as a sample from an underlying distribution over chord-to-chord transitions. The Shannon entropy of that distribution is the complexity measure: high entropy = wide chord palette used in roughly equal proportion; low entropy = small palette repeated.',
      },
      {
        kind: 'image',
        src: '/projects/rock-harmony/entropy-by-year.png',
        alt: 'Mean harmonic entropy by year, 1958–2020.',
        caption: 'Mean harmonic entropy by year, 1958–2020.',
      },
      {
        kind: 'text',
        content:
          'Mean entropy by year shows three regimes: a 1960s dip (the I–IV–V era), a 1970s climb (modal and extended harmony), and a long plateau through the modern-pop era. The trend is statistically significant under a mixed-effects regression with year as a fixed effect and song as a random effect, controlling for genre subcategory and decade-level autocorrelation.',
      },
      {
        kind: 'text',
        content:
          'Entropy also varies systematically by song section. Verses and choruses cluster at lower entropy — a tight palette holds the song\'s identity; bridges spike. This pattern is stable across decades even as overall entropy rises and falls, suggesting the structural function of the bridge as a "harmonic detour" is fixed regardless of fashion.',
      },
      {
        kind: 'image',
        src: '/projects/rock-harmony/entropy-by-section.png',
        alt: 'Mean entropy by song section (verse, chorus, bridge, outro).',
        caption: 'Mean entropy by song section — verses and choruses tight, bridges high, outros mixed.',
      },
      {
        kind: 'text',
        content:
          'Full methodology, robustness checks, and discussion are in the Music Theory Online article.',
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
    title: 'Reference-free Stem Separation Metrics',
    shortTitle: 'Stem Separation',
    description: 'Two new audio stem separation metrics — Frequency Isolation Score (FIS) and Dynamic Stability Score (DSS) — that work without ground-truth references.',
    tags: ['Audio DSP', 'Evaluation Metrics', 'Python', 'Research'],
    period: 'Jun – Dec 2024',
    category: 'Research',
    github: 'https://github.com/Jamesprocode',
    tileImage: '/projects/stem-separation/poster.jpg',
    body: [
      {
        kind: 'image',
        src: '/projects/stem-separation/poster.jpg',
        alt: 'Conference poster summarizing the framework and results.',
        caption: 'Conference poster — full one-page summary of the framework and results.',
      },
      {
        kind: 'text',
        content:
          'Senior CS thesis at Occidental College. Standard separation metrics (SDR, SIR, SAR from the BSS_EVAL toolkit) require clean ground-truth stems for evaluation, which restricts their use to academic benchmarks like MUSDB18 where stems exist by construction. This work introduces two reference-free metrics that correlate strongly with reference-based scores while removing the ground-truth requirement.',
      },
      {
        kind: 'text',
        content:
          'The first metric, Frequency Isolation Score (FIS), measures how much of a separated stem\'s spectral energy sits inside its expected frequency band. For a vocal stem the band is empirically derived (roughly 80 Hz to 8 kHz) with formant-aware weighting; a clean stem concentrates energy in-band, a leaky stem has a flatter spectrum because non-vocal instruments are bleeding through.',
      },
      {
        kind: 'text',
        content:
          'The second metric, Dynamic Stability Score (DSS), measures the temporal stability of a stem\'s envelope. Frame-level RMS and spectral flux are computed on overlapping 50 ms windows, and their variance is measured within stable musical segments (detected via novelty curves). A coherent stem has stable RMS and smooth spectral flux during sustained notes; a poorly-separated stem flickers as the separator drops in and out of the source.',
      },
      {
        kind: 'text',
        content:
          'To validate that the metrics carry the same signal-quality information as the reference-based gold standard, we regress SAR against each proposed metric across MUSDB18. Strong linear correlation indicates the reference-free metric is a viable substitute when ground truth is unavailable.',
      },
      {
        kind: 'image',
        src: '/projects/stem-separation/sar-vs-dss.png',
        alt: 'Linear regression: SAR vs DSS across the test set.',
        caption: 'SAR (reference-based) regressed against DSS (reference-free) — strong linear correlation across the test set.',
      },
      {
        kind: 'image',
        src: '/projects/stem-separation/sar-vs-fis.png',
        alt: 'Linear regression: SAR vs FIS across the test set.',
        caption: 'Same regression for FIS — comparable slope and R².',
      },
      {
        kind: 'text',
        content:
          'Across the full benchmark, FIS and DSS correlate at r > 0.7 with the reference-based scores — high enough for production use in pipelines where references are unavailable, with a known degradation profile when references are eventually needed for final evaluation.',
      },
      {
        kind: 'image',
        src: '/projects/stem-separation/pearson-correlation.png',
        alt: 'Pearson correlation matrix between FIS, DSS, and reference-based metrics.',
        caption: 'Pearson correlation matrix — reference-based vs. proposed metrics.',
      },
      {
        kind: 'text',
        content:
          'The work was presented at the Occidental spring research conference. The full thesis PDF is linked below.',
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
