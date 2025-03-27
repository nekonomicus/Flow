// flowchart-app/src/Flowchart.jsx
import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';

import 'reactflow/dist/style.css'; // Base styles
import './index.css'; // Your custom styles including Tailwind

// --- Node Definitions ---
// Manually position nodes. Adjust x/y values for layout.
// Grouping: Pilot Phase (Left Side), Main Phase (Right Side)
const initialNodes = [
  // General Flow
  { id: 'start', position: { x: 600, y: 0 }, data: { label: 'Project Start' }, className: 'circle-node' },
  { id: 'phase_decision', position: { x: 575, y: 120 }, data: { label: <div className="label-container">Select Phase</div> }, className: 'diamond-node' },
  { id: 'final_analysis', position: { x: 600, y: 1400 }, data: { label: 'Final Data Analysis & Reporting' } },
  { id: 'end', position: { x: 600, y: 1550 }, data: { label: 'Project End' }, className: 'circle-node' },

  // --- Pilot Phase Nodes (approx x=50 to x=400) ---
  { id: 'pilot_select_mri', position: { x: 50, y: 250 }, data: { label: 'Pilot: Identify Patient MRIs (n=30, LCEA>40, No PAO, RI<30%)' } },
  { id: 'pilot_segment', position: { x: 50, y: 350 }, data: { label: 'Pilot: Auto-Segment MRIs (Algo Tool)' } },
  { id: 'pilot_print_pelvis', position: { x: 50, y: 450 }, data: { label: 'Pilot: 3D Print Pelves (n=6, Radiopaque)' } },
  { id: 'pilot_xray_pre', position: { x: -50, y: 550 }, data: { label: 'Pilot: X-ray 3D Prints (Pre-Trim)' } },
  { id: 'pilot_art_xray_pre', position: { x: 150, y: 550 }, data: { label: 'Pilot: Generate Artificial X-rays from MRIs (Pre-Trim, Algo Tool)' } },
  { id: 'pilot_calc_trim', position: { x: 50, y: 650 }, data: { label: 'Pilot: Calculate Target Trim Depth (X-ray Sharp Angle)' } }, // Corrected label based on text
  { id: 'pilot_design_guide', position: { x: 50, y: 750 }, data: { label: 'Pilot: Design & Print Guide (Arc=90°)' } },
  { id: 'pilot_trim', position: { x: 50, y: 850 }, data: { label: 'Pilot: Perform Guided Trimming on 3D Prints' } },
  { id: 'pilot_xray_post', position: { x: -50, y: 950 }, data: { label: 'Pilot: X-ray 3D Prints (Post-Trim)' } },
  { id: 'pilot_measure_caliper', position: { x: 150, y: 950 }, data: { label: 'Pilot: Measure Trim Accuracy (Caliper vs Plan)' }, className: 'outcome-node' },
  { id: 'pilot_measure_lce', position: { x: -50, y: 1050 }, data: { label: 'Pilot: Measure Sharp Angle Change (X-ray vs Plan)' }, className: 'outcome-node' }, // Corrected label
  { id: 'pilot_analyze', position: { x: 50, y: 1150 }, data: { label: 'Pilot: Analyze Results & Refine Workflow' } },
  { id: 'pilot_end', position: { x: 50, y: 1250 }, data: { label: 'End Pilot Phase' } },

  // --- Main Phase Nodes (approx x=800 to x=1200) ---
  { id: 'main_acquire', position: { x: 850, y: 250 }, data: { label: 'Main: Acquire Cadavers (n=12 hips)' } },
  { id: 'main_mri_pre', position: { x: 850, y: 350 }, data: { label: 'Main: Pre-Op MRI on Cadavers' } },
  { id: 'main_xray_pre', position: { x: 1050, y: 350 }, data: { label: 'Main: Perform Standard Pre-Op X-rays' } },
  { id: 'main_segment_pre', position: { x: 750, y: 450 }, data: { label: 'Main: Auto-Segment Pre-Op MRIs (Algo Tool)' } },
  { id: 'main_analyze_3d_pre', position: { x: 750, y: 550 }, data: { label: 'Main: Analyze Pre-Op 3D Coverage Params (Algo Tool - Tertiary Outcome Baseline)' }, className: 'outcome-node' },
  { id: 'main_art_xray_pre', position: { x: 950, y: 550 }, data: { label: 'Main: Generate Artificial Pre-Op X-rays (Algo Tool)' } },
  { id: 'main_calc_trim', position: { x: 1050, y: 450 }, data: { label: 'Main: Calculate Target Trim Depth (X-ray & LCEA Formulas)' } }, // Corrected label based on text
  { id: 'main_design_guide', position: { x: 950, y: 650 }, data: { label: 'Main: Design & Print Patient-Specific Guide (Arc=90°)' } },
  { id: 'main_trim', position: { x: 950, y: 750 }, data: { label: 'Main: Perform Open Surgical Trimming with Guide' } },
  { id: 'main_measure_caliper', position: { x: 750, y: 850 }, data: { label: 'Main: Measure Trim Depth/Arc (Caliper @ 4 points - Primary Outcome)' }, className: 'outcome-node' },
  { id: 'main_mri_post', position: { x: 950, y: 850 }, data: { label: 'Main: Post-Op MRI on Cadavers' } },
  { id: 'main_xray_post', position: { x: 1150, y: 850 }, data: { label: 'Main: Perform Standard Post-Op X-rays' } },
  { id: 'main_segment_post', position: { x: 950, y: 950 }, data: { label: 'Main: Auto-Segment Post-Op MRIs (Algo Tool)' } },
  { id: 'main_measure_mri', position: { x: 750, y: 1050 }, data: { label: 'Main: Measure Trim Depth/Arc (MRI Superposition - Primary Outcome)' }, className: 'outcome-node' },
  { id: 'main_measure_lce_std', position: { x: 1150, y: 950 }, data: { label: 'Main: Measure Post-Op LCEA Change (Standard X-ray vs Plan - Secondary Outcome)' }, className: 'outcome-node' },
  { id: 'main_art_xray_post', position: { x: 950, y: 1050 }, data: { label: 'Main: Generate Artificial Post-Op X-rays (Algo Tool)' } },
  { id: 'main_measure_lce_art', position: { x: 950, y: 1150 }, data: { label: 'Main: Measure Post-Op LCEA Change (Artificial X-ray vs Plan - Secondary Outcome)' }, className: 'outcome-node' },
  { id: 'main_analyze_3d_post', position: { x: 750, y: 1150 }, data: { label: 'Main: Analyze Post-Op 3D Coverage Params (Algo Tool - Tertiary Outcome)' }, className: 'outcome-node' },
  { id: 'main_correlate', position: { x: 950, y: 1250 }, data: { label: 'Main: Correlate Trim Depth vs LCEA Change (Tertiary Outcome Analysis)' }, className: 'outcome-node' },
  { id: 'main_end', position: { x: 950, y: 1350 }, data: { label: 'End Main Phase' } },
];

// --- Edge Definitions ---
const initialEdges = [
  // General Flow Edges
  { id: 'e-start-decision', source: 'start', target: 'phase_decision', type: 'smoothstep' },
  { id: 'e-decision-pilot', source: 'phase_decision', target: 'pilot_select_mri', label: 'Pilot Phase', type: 'smoothstep' },
  { id: 'e-decision-main', source: 'phase_decision', target: 'main_acquire', label: 'Main Phase', type: 'smoothstep' },
  { id: 'e-pilot_end-final', source: 'pilot_end', target: 'final_analysis', type: 'smoothstep', animated: false, className: 'dashed-edge' }, // Dashed line
  { id: 'e-main_end-final', source: 'main_end', target: 'final_analysis', type: 'smoothstep', animated: false, className: 'dashed-edge' },   // Dashed line
  { id: 'e-final-end', source: 'final_analysis', target: 'end', type: 'smoothstep' },

  // Pilot Phase Flow Edges
  { id: 'e-pilot_select-segment', source: 'pilot_select_mri', target: 'pilot_segment', type: 'smoothstep' },
  { id: 'e-pilot_segment-print', source: 'pilot_segment', target: 'pilot_print_pelvis', type: 'smoothstep' },
  { id: 'e-pilot_print-xray_pre', source: 'pilot_print_pelvis', target: 'pilot_xray_pre', type: 'smoothstep' },
  { id: 'e-pilot_segment-art_xray_pre', source: 'pilot_segment', target: 'pilot_art_xray_pre', type: 'smoothstep' },
  { id: 'e-pilot_xray_pre-calc', source: 'pilot_xray_pre', target: 'pilot_calc_trim', type: 'smoothstep' },
  // Corrected: Artificial X-rays likely aren't used for Pilot Calc (using Sharp on real X-ray)
  // { id: 'e-pilot_art_xray_pre-calc', source: 'pilot_art_xray_pre', target: 'pilot_calc_trim', type: 'smoothstep'},
  { id: 'e-pilot_calc-design', source: 'pilot_calc_trim', target: 'pilot_design_guide', type: 'smoothstep' },
  { id: 'e-pilot_design-trim', source: 'pilot_design_guide', target: 'pilot_trim', type: 'smoothstep' },
  { id: 'e-pilot_print-trim', source: 'pilot_print_pelvis', target: 'pilot_trim', type: 'smoothstep' }, // Added missing connection
  { id: 'e-pilot_trim-xray_post', source: 'pilot_trim', target: 'pilot_xray_post', type: 'smoothstep' },
  { id: 'e-pilot_trim-caliper', source: 'pilot_trim', target: 'pilot_measure_caliper', type: 'smoothstep' },
  { id: 'e-pilot_xray_post-lce', source: 'pilot_xray_post', target: 'pilot_measure_lce', type: 'smoothstep' },
  { id: 'e-pilot_caliper-analyze', source: 'pilot_measure_caliper', target: 'pilot_analyze', type: 'smoothstep' },
  { id: 'e-pilot_lce-analyze', source: 'pilot_measure_lce', target: 'pilot_analyze', type: 'smoothstep' },
  { id: 'e-pilot_analyze-end', source: 'pilot_analyze', target: 'pilot_end', type: 'smoothstep' },

  // Main Phase Flow Edges
  { id: 'e-main_acquire-mri_pre', source: 'main_acquire', target: 'main_mri_pre', type: 'smoothstep' },
  { id: 'e-main_acquire-xray_pre', source: 'main_acquire', target: 'main_xray_pre', type: 'smoothstep' },
  { id: 'e-main_mri_pre-segment_pre', source: 'main_mri_pre', target: 'main_segment_pre', type: 'smoothstep' },
  { id: 'e-main_segment_pre-analyze_3d_pre', source: 'main_segment_pre', target: 'main_analyze_3d_pre', type: 'smoothstep' },
  { id: 'e-main_segment_pre-art_xray_pre', source: 'main_segment_pre', target: 'main_art_xray_pre', type: 'smoothstep' },
  { id: 'e-main_xray_pre-calc', source: 'main_xray_pre', target: 'main_calc_trim', type: 'smoothstep' },
  // Corrected: Artificial X-rays likely feed into calc/planning too
  { id: 'e-main_art_xray_pre-calc', source: 'main_art_xray_pre', target: 'main_calc_trim', type: 'smoothstep'},
  { id: 'e-main_calc-design', source: 'main_calc_trim', target: 'main_design_guide', type: 'smoothstep' },
  { id: 'e-main_design-trim', source: 'main_design_guide', target: 'main_trim', type: 'smoothstep' },
  // { id: 'e-main_acquire-trim', source: 'main_acquire', target: 'main_trim', type: 'smoothstep' }, // Redundant if coming from design guide
  { id: 'e-main_trim-caliper', source: 'main_trim', target: 'main_measure_caliper', type: 'smoothstep' },
  { id: 'e-main_trim-mri_post', source: 'main_trim', target: 'main_mri_post', type: 'smoothstep' },
  { id: 'e-main_trim-xray_post', source: 'main_trim', target: 'main_xray_post', type: 'smoothstep' },
  { id: 'e-main_mri_post-segment_post', source: 'main_mri_post', target: 'main_segment_post', type: 'smoothstep' },
  { id: 'e-main_segment_post-measure_mri', source: 'main_segment_post', target: 'main_measure_mri', type: 'smoothstep' },
  { id: 'e-main_segment_post-art_xray_post', source: 'main_segment_post', target: 'main_art_xray_post', type: 'smoothstep' },
  { id: 'e-main_segment_post-analyze_3d_post', source: 'main_segment_post', target: 'main_analyze_3d_post', type: 'smoothstep' },
  { id: 'e-main_xray_post-lce_std', source: 'main_xray_post', target: 'main_measure_lce_std', type: 'smoothstep' },
  { id: 'e-main_art_xray_post-lce_art', source: 'main_art_xray_post', target: 'main_measure_lce_art', type: 'smoothstep' },
  // Link outcomes to correlate/end phase
  { id: 'e-main_measure_mri-correlate', source: 'main_measure_mri', target: 'main_correlate', type: 'smoothstep' },
  { id: 'e-main_measure_lce_std-correlate', source: 'main_measure_lce_std', target: 'main_correlate', type: 'smoothstep' },
  { id: 'e-main_measure_lce_art-correlate', source: 'main_measure_lce_art', target: 'main_correlate', type: 'smoothstep' },
  { id: 'e-main_correlate-end', source: 'main_correlate', target: 'main_end', type: 'smoothstep' },
  // Other outcomes also link to the end
   { id: 'e-main_analyze_3d_post-end', source: 'main_analyze_3d_post', target: 'main_end', type: 'smoothstep' },
   { id: 'e-main_measure_caliper-end', source: 'main_measure_caliper', target: 'main_end', type: 'smoothstep' }, // Make sure all paths converge

];

const edgeOptions = {
  // animated: true, // Optional: Animate all edges
  style: {
    strokeWidth: 1.5,
    stroke: '#6b7280', // Gray-500
  },
};

const connectionLineStyle = { stroke: '#6b7280' };

function Flowchart() {
  // Although we don't change nodes/edges here, using the hooks is standard practice
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // We don't need connection logic for a static chart
  // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    // Set a fixed height for the React Flow container
    <div style={{ height: '1700px', width: '100%' }} className="bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange} // Allows panning/dragging nodes (can be removed for static)
        onEdgesChange={onEdgesChange} // Allows edge manipulation (can be removed for static)
        // onConnect={onConnect} // If you wanted interactive connection
        defaultEdgeOptions={edgeOptions}
        connectionLineStyle={connectionLineStyle}
        fitView // Zoom/pan to fit initial nodes
        fitViewOptions={{ padding: 0.1 }} // Add some padding on fitView
      >
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Background variant="dots" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

export default Flowchart;
