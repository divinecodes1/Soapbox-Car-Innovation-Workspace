export interface TeamInput {
  role: string;
  input: string;
  meaning: string;
}

export interface FunctionalRequirement {
  id: string;
  requirement: string;
  reason: string;
}

export interface NonFunctionalRequirement {
  id: string;
  requirement: string;
  reason: string;
}

export interface ScoringOption {
  id: string;
  option: string;
  description: string;
  type: string;
  control: number;
  safety: number;
  feasibility: number;
  cost: number;
  test: number;
}

export interface MoSCoWItem {
  item: string;
  reason: string;
  category: 'Must' | 'Should' | 'Could' | 'Won\'t';
}

export interface RoadmapPhase {
  phase: number;
  focus: string;
  actions: string[];
  successCheck: string;
}

export interface RiskItem {
  risk: string;
  likelihood: number;
  severity: number;
  mitigation: string;
}

export interface ProjectData {
  title: string;
  author: string;
  role: string;
  semester: string;
  course: string;
  supervisor: string;
  teamInputs: TeamInput[];
  userNeeds: {
    pains: string[];
    gains: string[];
    fears: string[];
    jobs: string[];
    painRelievers: string[];
  };
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  scoringCriteria: {
    name: string;
    weight: number;
    reason: string;
  }[];
  options: ScoringOption[];
  moscow: MoSCoWItem[];
  roadmap: RoadmapPhase[];
  risks: RiskItem[];
}

export const soapboxData: ProjectData = {
  title: "User-Centric Innovation Plan for the Soapbox Car",
  author: "Parth Goswami (12611068)",
  role: "Innovation Manager (Group B)",
  semester: "Summer Semester 2026",
  course: "Digital Car / Innovation Management & Customer Centric Design",
  supervisor: "Prof. Dr. Markus Straßberger",
  teamInputs: [
    {
      role: "Braking Engineer",
      input: "Mechanical friction brake with rubber contact pads, manual lever, and elastic return. The pad, return cord, and pivot geometry were improved.",
      meaning: "Braking should be maintained through checks rather than redesigned first."
    },
    {
      role: "Chassis and Suspension Engineer",
      input: "Earlier chassis showed steering delay, possible frame twist, limited feedback, and weak steering mount precision.",
      meaning: "Chassis rigidity is necessary before the steering upgrade can work properly."
    },
    {
      role: "Steering Engineer",
      input: "Rope/string steering creates fatigue, fear of failure, and an unnatural steering feel. A joystick-controlled rope hybrid was selected as the realistic improvement.",
      meaning: "Steering confidence should be the first technical focus."
    },
    {
      role: "Safety Manager",
      input: "Important actions include brake testing, inspection checklist, helmet, seatbelt, load test, and driver protection.",
      meaning: "Safety must be integrated into every test run."
    },
    {
      role: "Design and Ergonomics Lead",
      input: "The car should be comfortable, easy to enter and exit, visually clear, and practical to build.",
      meaning: "The driver interface and seating position must be checked with the real driver."
    },
    {
      role: "Driver Experience Engineer",
      input: "ESP32 + Hall sensor + smartphone display was selected as the feasible speed-feedback concept.",
      meaning: "Speed feedback is useful after steering, braking, and safety are stable."
    },
    {
      role: "HMI Engineer",
      input: "Speed display, crash alert, daylight readability, tilt sensor, and battery feedback were evaluated.",
      meaning: "HMI should give useful information at a glance and should not distract the driver."
    },
    {
      role: "Race and Testing Coordinator",
      input: "Proposed wheel alignment, lower centre of gravity, pusher-driver coordination, brake-zone markers, timed runs, and telemetry.",
      meaning: "Testing should confirm whether changes improve performance and consistency."
    }
  ],
  userNeeds: {
    jobs: [
      "Complete the race quickly and safely, especially through turns and figure-8 manoeuvres."
    ],
    pains: [
      "Steering feels uncertain",
      "Steering post is not yet ergonomic",
      "Chassis flex can reduce precision",
      "Wheel geometry needs tuning"
    ],
    fears: [
      "Loss of steering control",
      "Brake failure",
      "Loose fasteners",
      "Seat movement during turning/braking",
      "Possible driver ejection"
    ],
    gains: [
      "Low-effort steering",
      "Predictable turning response",
      "Reliable braking",
      "Stable seat",
      "Simple, clear driver feedback",
      "Driver confidence during testing"
    ],
    painRelievers: [
      "Reinforced steering mount",
      "Joystick interface",
      "Chassis bracing",
      "Mandatory brake test",
      "Pre-run inspection checklist",
      "Wheel alignment",
      "Seatbelt & seat fixation"
    ]
  },
  functionalRequirements: [
    {
      id: "FR-01",
      requirement: "Provide directional control through one reachable driver input.",
      reason: "The driver needs predictable steering without handling loose ropes directly."
    },
    {
      id: "FR-02",
      requirement: "Reinforce the steering mount and surrounding chassis area.",
      reason: "Steering input should not be lost through frame movement."
    },
    {
      id: "FR-03",
      requirement: "Add torsional reinforcement to the chassis.",
      reason: "A stiffer chassis gives more consistent steering and braking behaviour."
    },
    {
      id: "FR-04",
      requirement: "Maintain a reliable braking system with pre-run testing.",
      reason: "Braking is acceptable, but it remains safety-critical."
    },
    {
      id: "FR-05",
      requirement: "Verify wheel alignment and steering geometry before testing.",
      reason: "Misalignment can create drag, instability, and poor turning response."
    },
    {
      id: "FR-06",
      requirement: "Secure the driver seat and verify restraint.",
      reason: "The driver must remain stable during braking and cornering."
    },
    {
      id: "FR-07",
      requirement: "Support speed feedback after mechanical validation.",
      reason: "Speed data helps the driver and testing team improve performance."
    }
  ],
  nonFunctionalRequirements: [
    {
      id: "NFR-01",
      requirement: "The solution should stay within the project budget.",
      reason: "The team must use low-cost and available materials."
    },
    {
      id: "NFR-02",
      requirement: "The solution should be buildable with workshop tools.",
      reason: "Complex fabrication should be avoided in the remaining project time."
    },
    {
      id: "NFR-03",
      requirement: "The steering interface should reduce driver effort.",
      reason: "This directly improves comfort and confidence."
    },
    {
      id: "NFR-04",
      requirement: "Safety features should add minimal additional weight.",
      reason: "Extra mass reduces gravity-driven performance."
    },
    {
      id: "NFR-05",
      requirement: "Components should be inspectable and repairable quickly.",
      reason: "Race-day fixes must be possible without special tools."
    },
    {
      id: "NFR-06",
      requirement: "Controls and feedback should remain simple during the run.",
      reason: "The driver has very little time to process information."
    }
  ],
  scoringCriteria: [
    { name: "Driver control and confidence", weight: 0.30, reason: "Steering has the strongest influence on driver trust and race performance." },
    { name: "Safety and reliability", weight: 0.25, reason: "Steering, braking, and seat failures can create serious risk." },
    { name: "Feasibility and buildability", weight: 0.20, reason: "The solution must be realistic for the team and workshop." },
    { name: "Cost efficiency", weight: 0.15, reason: "The project budget is limited." },
    { name: "Testability and maintenance", weight: 0.10, reason: "The team must be able to inspect and adjust the system quickly." }
  ],
  options: [
    {
      id: "A",
      option: "Current chassis + current steering",
      description: "Keep the existing system with only minor repairs.",
      type: "Baseline",
      control: 1, safety: 2, feasibility: 5, cost: 5, test: 3
    },
    {
      id: "B",
      option: "Improved chassis + rope steering",
      description: "Reinforce the chassis but keep the rope steering interface.",
      type: "Incremental",
      control: 2, safety: 3, feasibility: 4, cost: 4, test: 4
    },
    {
      id: "C",
      option: "Improved chassis + mechanical joystick steering",
      description: "Use a joystick as the driver interface while ropes/cables can remain hidden as actuation elements.",
      type: "Adjacent",
      control: 4, safety: 4, feasibility: 4, cost: 4, test: 4
    },
    {
      id: "D",
      option: "Low-profile chassis + rigid linkage",
      description: "Build a more performance-oriented chassis with physical steering links.",
      type: "Advanced",
      control: 5, safety: 4, feasibility: 2, cost: 2, test: 3
    },
    {
      id: "E",
      option: "Electronic or differential steering",
      description: "Use servo-assisted steering or brake-based differential turning.",
      type: "Disruptive",
      control: 4, safety: 2, feasibility: 1, cost: 1, test: 2
    }
  ],
  moscow: [
    { item: "Rigid mechanical joystick mount", reason: "Core steering improvement. Without a rigid mount, the joystick will still feel loose.", category: "Must" },
    { item: "Steering mount reinforcement", reason: "Prevents flex and makes steering response more predictable.", category: "Must" },
    { item: "Chassis torsional reinforcement", reason: "Reduces frame twist during turning and braking.", category: "Must" },
    { item: "Secure rope/cable tensioning", reason: "Prevents steering slack and reduces fear of failure.", category: "Must" },
    { item: "Mechanical steering stops", reason: "Prevents over-steering and protects the steering mechanism.", category: "Must" },
    { item: "Brake function test before every run", reason: "Maintains the improved braking system and protects the driver.", category: "Must" },
    { item: "Pre-run inspection checklist", reason: "Confirms wheels, fasteners, steering, seat, and brake before testing.", category: "Must" },
    { item: "Helmet, seat, and restraint verification", reason: "The driver must remain protected and stable during braking and cornering.", category: "Must" },
    { item: "Lower seat position", reason: "Reduces centre of gravity and improves cornering confidence.", category: "Should" },
    { item: "Wheel alignment tuning", reason: "Reduces steering instability and rolling resistance.", category: "Should" },
    { item: "Low-friction steering guides or pulleys", reason: "Reduces steering effort and improves driver comfort.", category: "Should" },
    { item: "Brake-zone markers", reason: "Helps the driver brake consistently during test runs.", category: "Should" },
    { item: "Figure-8 and slalom validation testing", reason: "Tests whether the steering improvement works in realistic conditions.", category: "Should" },
    { item: "ESP32 + Hall sensor speed display", reason: "Useful after mechanical systems are stable.", category: "Should" },
    { item: "Driver feedback sheet after each run", reason: "Keeps the process user-centred and evidence-based.", category: "Should" },
    { item: "Crash / impact alert", reason: "Good safety-related HMI feature, but secondary to mechanical safety.", category: "Could" },
    { item: "Tilt / incline display", reason: "Useful for analysis, but not required for first steering validation.", category: "Could" },
    { item: "Lap/split time logger", reason: "Helpful for testing, but can wait until the car is mechanically predictable.", category: "Could" },
    { item: "Cockpit padding", reason: "Adds comfort and minor protection if time and material allow.", category: "Could" },
    { item: "Full electronic steering", reason: "Too complex and costly for the current project phase.", category: "Won't" },
    { item: "Differential steering", reason: "Risky because asymmetric braking can destabilise the vehicle.", category: "Won't" },
    { item: "Heart-rate monitor", reason: "Too expensive for the benefit it gives in this race.", category: "Won't" },
    { item: "Cosmetic LED strip", reason: "Low value compared with steering, safety, and braking.", category: "Won't" }
  ],
  roadmap: [
    {
      phase: 1,
      focus: "Safety and current-state fixes",
      actions: ["Complete brake test", "Check fasteners", "Review seat fixation", "Review body edges for sharpness"],
      successCheck: "No loose fasteners and the brake operates reliably."
    },
    {
      phase: 2,
      focus: "Steering and chassis MVP",
      actions: ["Build rigid joystick mount", "Reinforce steering mount", "Add diagonal bracing to chassis", "Secure rope/cable tensioning", "Add mechanical steering stops"],
      successCheck: "Steering post does not flex under driver input."
    },
    {
      phase: 3,
      focus: "Geometry and driver validation",
      actions: ["Tune wheel alignment", "Reduce steering friction", "Test steering reach with driver", "Run slow slalom and figure-8 tests"],
      successCheck: "Driver reports better control and lower effort."
    },
    {
      phase: 4,
      focus: "Performance testing",
      actions: ["Add brake-zone markers", "Set up pusher-driver communication signals", "Conduct repeated timed runs", "Fill driver feedback sheets"],
      successCheck: "Run times and cornering consistency improve."
    },
    {
      phase: 5,
      focus: "Digital support",
      actions: ["Add ESP32 + Hall sensor speed display", "Consider crash alert, tilt display, and data logging"],
      successCheck: "Digital feedback supports decisions without distracting the driver."
    }
  ],
  risks: [
    { risk: "Steering mount flexes during run", likelihood: 4, severity: 5, mitigation: "Reinforce mount, add bracing, and perform a static steering-load test." },
    { risk: "Rope/cable slack causes delayed steering", likelihood: 4, severity: 4, mitigation: "Add secure tensioning and inspect before every run." },
    { risk: "Brake does not stop reliably", likelihood: 3, severity: 5, mitigation: "Maintain brake pad, check alignment, and perform mandatory brake test." },
    { risk: "Driver slides or shifts in seat", likelihood: 3, severity: 4, mitigation: "Verify seat fixation and install restraint before higher-speed testing." },
    { risk: "Wheel fastener loosens", likelihood: 3, severity: 5, mitigation: "Use inspection checklist, lock nuts, and axle-end checks." },
    { risk: "Rear wing flexes or breaks", likelihood: 2, severity: 3, mitigation: "Check rigidity; remove or lighten if it creates instability." },
    { risk: "HMI distracts driver", likelihood: 2, severity: 3, mitigation: "Keep display simple and delay digital features until mechanical validation." }
  ]
};

export const lectureNotes = {
  designThinking: {
    title: "Design Thinking Methodology",
    source: "Stanford d.school Playbook & Lectures",
    phases: [
      {
        name: "Empathize",
        description: "Understand your customer. Observe their behavior in context and engage by talking to them.",
        actions: [
          "Observe users' daily lives",
          "Conduct face-to-face interviews",
          "Dig deeper for feelings and stories (ask 'Why' 4-5 times)",
          "Avoid leading questions"
        ]
      },
      {
        name: "Define",
        description: "Take the customer's point of view (POV) based on user needs and insights.",
        actions: [
          "Develop a specific, meaningful challenge statement",
          "Synthesize learnings into core needs (use verbs!)",
          "Map needs on an Empathy Map (Say, Do, Think, Feel)"
        ]
      },
      {
        name: "Ideate",
        description: "Brainstorming and expanding the solution space. Go for quantity before quality.",
        actions: [
          "Brainstorm wild, fancy, creative ideas",
          "Do not judge or critique ideas too early",
          "Use variations like Walt-Disney (Dreamer, Realist, Critic) or World Café"
        ]
      },
      {
        name: "Prototype",
        description: "Build low-resolution, quick models to show, not tell.",
        actions: [
          "Keep prototypes cheap and quick",
          "Focus on one aspect of the solution",
          "Build to learn and validate assumptions"
        ]
      },
      {
        name: "Test",
        description: "Start testing with real users to get feedback.",
        actions: [
          "Listen to feedback, don't defend your prototype",
          "Watch how they use or misuse it",
          "Iterate based on insights"
        ]
      }
    ]
  },
  devOps: {
    title: "Automotive DevOps Lifecycle",
    principles: [
      "Eliminate Waste (deliver MVPs)",
      "Create Knowledge & continuous learning",
      "Build Quality In (ensure quality at every step)",
      "Deliver Fast (focus on small increments)",
      "Respect People & empower the team",
      "Delay in making decisions (decide at the Last Responsible Moment)",
      "Optimize the Whole (think in systems, not silos)"
    ],
    contrast: {
      vehicle1: { name: "Vehicle 1.0 (Functional)", features: ["No OTA updates", "Tightly coupled ECUs", "Basic infotainment", "CAN-based"] },
      vehicle2: { name: "Vehicle 2.0 (Digital)", features: ["Brought-in infotainment apps", "Limited software updates", "Cloud platform content", "4G"] },
      vehicle3: { name: "Vehicle 3.0 (Updateable)", features: ["Regular OTA updates for core domains", "Dynamic HMI", "Ethernet backbone", "Domain middleware"] },
      vehicle4: { name: "Vehicle 4.0 (Software-Defined)", features: ["Redundant application processing", "Continuous SW delivery", "Edge application runtime", "5G", "Compute sharing"] }
    }
  },
  hypeCycle: {
    title: "Gartner Hype Cycle (2024-2026)",
    phases: [
      { name: "Innovation Trigger", desc: "A breakthrough or product launch kickstarts public interest." },
      { name: "Peak of Inflated Expectations", desc: "Early publicity produces success stories, along with failures. High enthusiasm." },
      { name: "Trough of Disillusionment", desc: "Interest wanes as experiments and implementations fail to deliver." },
      { name: "Slope of Enlightenment", desc: "More instances of how the tech can benefit enterprises become understood." },
      { name: "Plateau of Productivity", desc: "Mainstream adoption starts to take off. Real-world benefits are broadly proven." }
    ],
    technologies: [
      { name: "Generative AI / LLMs", phase: "Peak of Inflated Expectations", position: 35, impact: "Revolutionizing speech dialog systems, making them stateful and context-adaptive." },
      { name: "Level 4 Valet Parking", phase: "Trough of Disillusionment", position: 52, impact: "Drop vehicle at entrance, fully autonomous inside garage." },
      { name: "Level 3 Highway Automation", phase: "Slope of Enlightenment", position: 68, impact: "Conditional automation where driver can hand over control under specific conditions." },
      { name: "Connected Car Fleet (Built-in 4G/5G)", phase: "Plateau of Productivity", position: 90, impact: "Standard requirement. 96% of new vehicles shipped worldwide by 2030." },
      { name: "Autonomic Systems", phase: "Innovation Trigger", position: 15, impact: "Self-managing software systems that learn and adapt in real-time." }
    ]
  }
};
