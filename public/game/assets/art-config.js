/* Visual configuration. Edit this file only; story/game rules are untouched.
   Scenes: a missing image falls back to the old code-drawn scene.
   Hotspots, bounds and material-surface rectangles use tiles on a 30 x 18 grid
   (1 tile = 32 px on a 960 x 576 canvas). playerHeight is the visible character
   height in canvas pixels; it is tuned per scene to match furniture and street objects.
   Surface tile size is also in grid units.
   MATERIAL_SURFACES_ENABLED can be set false to disable material overlays.
   Open index.html?debug=1 (or press Shift+G) to show the grid; click the map to print coordinates. */
window.TEAM6_ART = {
  spriteHeight: 70,
  /* Full scene illustrations already include their surfaces. Keep separate material swatches off
     by default so their rectangular overlays do not break the perspective of the finished art. */
  MATERIAL_SURFACES_ENABLED: false,
  materials: {
    home_oak: 'assets/materials/home_warm_oak_floor.png',
    home_wall: 'assets/materials/home_offwhite_wall.png',
    route_paving: 'assets/materials/park_paving_slabs.png',
    route_bench: 'assets/materials/atrium_bench_wood_slats.png',
    atrium_stone: 'assets/materials/atrium_pale_stone_tile.png',
    atrium_metal: 'assets/materials/entrance_brushed_metal.png',
    classroom_desk: 'assets/materials/project_space_desk_laminate.png',
    classroom_board: 'assets/materials/project_space_blank_corkboard.png',
    lunch_floor: 'assets/materials/cafe_floor_beige_tiles.png',
    lunch_counter: 'assets/materials/cafe_counter_laminate.png'
  },
  ambient: {
    car: 'assets/ambient/car.png', pedestrian: 'assets/ambient/pedestrian.png',
    dogWalk: 'assets/ambient/dog_walk.png', dogBark: 'assets/ambient/dog_bark.png',
    excavatorBody: 'assets/ambient/excavator_body.png', excavatorArm: 'assets/ambient/excavator_arm.png',
    vehicleSheet: 'assets/ambient/vehicle_sheet.png', pedestrianWalkSheet: 'assets/ambient/pedestrian_walk_sheet.png',
    dogWalkCycle: 'assets/ambient/dog_walk_cycle.png'
  },
  /* Walk crops are per facing row [x,y,w,h] inside one sprite-sheet cell. They trim
     transparent padding so the visible soles meet the ground anchor consistently. */
  sprites: {
    /* Single front-facing images; the same pose is mirrored when facing left. */
    mei:   { src: 'assets/sprites/mei.png',   cols: 1, rows: 1, walkSrc:'assets/sprites/mei_walk.png', walkCols:4, walkRows:4, walkCrops:[[99,14,120,281],[97,17,119,272],[98,16,127,274],[101,18,111,275]], actionSrc:'assets/sprites/mei_actions.png', actionCols:4, actionRows:3, crop: { x: 36, y: 19, w: 37, h: 75 }, headCrop: { x: 36, y: 19, w: 37, h: 34 }, reactions:{headache:{src:'assets/sprites/reactions/mei_headache.png',widthScale:1.26},fatigue:{src:'assets/sprites/reactions/mei_fatigue_rest.png',widthScale:1.1,mapPose:false},quietPause:{src:'assets/sprites/reactions/mei_quiet_pause.png',widthScale:1.08,mapPose:false},meiSensoryOverload:{src:'assets/sprites/reactions/mei_sensory_overload.png',widthScale:1.12,mapPose:false},meiHeadachePose:{src:'assets/sprites/reactions/mei_headache_pose.png',widthScale:1.12,mapPose:false},meiSeatedRest:{src:'assets/sprites/reactions/mei_seated_rest.png',widthScale:1.15,mapPose:false}} },
    sam:   { src: 'assets/sprites/sam.png',   cols: 1, rows: 1, walkSrc:'assets/sprites/sam_walk.png', walkCols:4, walkRows:4, walkCrops:[[94,14,133,286],[96,15,131,282],[91,15,144,280],[96,12,123,287]], actionSrc:'assets/sprites/sam_actions.png', actionCols:4, actionRows:3, crop: { x: 28, y: 21, w: 40, h: 73 }, headCrop: { x: 28, y: 21, w: 40, h: 33 }, reactions:{soundPause:{src:'assets/sprites/reactions/sam_sound_pause.png',widthScale:1.48},fever:{src:'assets/sprites/reactions/sam_feverish.png',widthScale:1.2,mapPose:false},nausea:{src:'assets/sprites/reactions/sam_nausea.png',widthScale:1.08,mapPose:false},samRequestPause:{src:'assets/sprites/reactions/sam_request_pause.png',widthScale:1.12,mapPose:false},samSocialUncertainty:{src:'assets/sprites/reactions/sam_social_uncertainty.png',widthScale:1.12,mapPose:false},samNauseaPose:{src:'assets/sprites/reactions/sam_nausea_pose.png',widthScale:1.12,mapPose:false}} },
    leila: { src: 'assets/sprites/leila.png', cols: 1, rows: 1, walkSrc:'assets/sprites/leila_walk.png', walkCols:4, walkRows:4, walkCrops:[[91,21,153,270],[87,19,152,270],[85,19,146,269],[89,21,140,269]], actionSrc:'assets/sprites/leila_actions.png', actionCols:4, actionRows:3, crop: { x: 36, y: 28, w: 24, h: 66 }, headCrop: { x: 36, y: 28, w: 24, h: 30 }, reactions:{glare:{src:'assets/sprites/reactions/leila_light_sensitivity.png',widthScale:1},lightheaded:{src:'assets/sprites/reactions/leila_lightheaded_pause.png',widthScale:1},fainting:{src:'assets/sprites/reactions/leila_fainting_support.png',widthScale:1,mapPose:false},tension:{src:'assets/sprites/reactions/leila_tense_pause.png',widthScale:1.08,mapPose:false},leilaGlareStepback:{src:'assets/sprites/reactions/leila_glare_stepback.png',widthScale:1.12,mapPose:false},leilaSeatedPause:{src:'assets/sprites/reactions/leila_seated_pause.png',widthScale:1.1,mapPose:false},leilaRequestHelp:{src:'assets/sprites/reactions/leila_request_help.png',widthScale:1.12,mapPose:false}} }
  },
  scenes: {
    home: { src: 'assets/scenes/home.png', playerHeight: 132, perspective: { far: 0.9, near: 1 }, groundOffset: 16, start: { x: 9.2, y: 13.2 }, bedIntro:{x:5,y:12.7,height:132}, duvetSourcePolygon:[[279,533],[408,534],[429,554],[410,709],[257,706],[256,565]], exit:{x:27.6,y:15.4}, bounds: { x0: 1, x1: 29, y0: 4, y1: 16 },
      hotspots: { schedule: { x: 5, y: 5 }, bag: { x: 21, y: 5 }, preview: { x: 15, y: 13 } },
      surfaces: [
        { material: 'home_oak', x: 23, y: 16, w: 6, h: 2, tile: 2, opacity: 0.78, purpose: 'small exposed floor patch', confidence: 'medium' },
        { material: 'home_wall', x: 27, y: 0, w: 3, h: 2, tile: 1, opacity: 0.72, purpose: 'upper-right wall patch', confidence: 'low-medium' }
      ] },
    route: { src: 'assets/scenes/route_animated_base.png', playerHeight: 76, perspective: { far: 0.72, near: 1 }, groundOffset: 16, start: { x: 3, y: 11 }, exit:{x:15.5,y:4.8}, bounds: { x0: 0.4, x1: 28, y0: 4, y1: 16 },
      /* A broad route corridor follows the plaza, main paved path and top crossing.
         The fenced construction area, planting beds and stair surfaces stay outside it. */
      walkableZones: [
        { points: [[9.7,4.1],[18.7,4.1],[20.5,5.3],[21.7,7.1],[23.6,8.7],[25.3,10.4],[26.4,12.4],[27,14.6],[25.4,16],[6.5,16],[6.2,14],[6.8,12],[6.6,10.3],[7.3,8.5],[8.2,6.4]] },
        { points: [[0.4,7.6],[4.6,7.6],[6.7,8],[7.4,10.3],[7.5,12],[6.7,14],[5.5,16],[3.2,16],[1,14.5],[0.4,13.2]] },
        { points: [[18.4,5.2],[20,5.1],[21.4,6],[23.4,6.4],[24.6,6.7],[25,7.5],[24.7,8.4],[23,8.3],[21.1,7.8],[19.6,7.4],[18.5,6.5]] }
      ],
      hotspots: { station: { x: 5, y: 9 }, street: { x: 15, y: 12 }, park: { x: 21, y: 6.5 } },
      surfaces: [
        { material: 'route_paving', x: 14, y: 4, w: 6, h: 2, tile: 2, opacity: 0.72, purpose: 'clear paving on the central walkway', confidence: 'medium' },
        { material: 'route_bench', x: 24, y: 4, w: 2, h: 1, tile: 1, opacity: 0.82, purpose: 'middle section of the visible bench seat', confidence: 'medium' }
      ] },
  atrium: { src: 'assets/scenes/atrium.png', playerHeight: 78, perspective: { far: 0.78, near: 1 }, groundOffset: 16, start: { x: 14, y: 15 }, exit:{x:27,y:15}, bounds: { x0: 2, x1: 28, y0: 5.5, y1: 16 }, walkableZones:[{x0:2,x1:29,y0:8.5,y1:16},{x0:2,x1:29,y0:5.5,y1:7.5},{x0:22.2,x1:29,y0:7.2,y1:14.5}],
      hotspots: { entry: { x: 14, y: 15 }, reception: { x: 4, y: 9 }, room: { x: 26, y: 11 } },
      surfaces: [
        { material: 'atrium_stone', x: 8, y: 8, w: 10, h: 4, tile: 2, opacity: 0.72, purpose: 'open central floor patch', confidence: 'medium-high' },
        { material: 'atrium_metal', x: 15, y: 3, w: 1, h: 2, tile: 1, opacity: 0.78, purpose: 'left elevator door face', confidence: 'medium' },
        { material: 'atrium_metal', x: 17, y: 3, w: 1, h: 2, tile: 1, opacity: 0.78, purpose: 'right elevator door face', confidence: 'medium' }
      ] },
    classroom: { src: 'assets/scenes/classroom.png', playerHeight: 78, perspective: { far: 0.78, near: 1 }, groundOffset: 16, start: { x: 15, y: 15 }, exit:{x:27,y:15}, bounds: { x0: 2, x1: 28, y0: 7, y1: 16 },
      hotspots: { seat: { x: 6, y: 12 }, group: { x: 15, y: 10 }, change: { x: 24, y: 6 } },
      surfaces: [
        { material: 'classroom_desk', x: 11, y: 9, w: 6, h: 1, tile: 1, opacity: 0.82, purpose: 'central tabletop detail', confidence: 'medium' },
        { material: 'classroom_board', x: 21, y: 3, w: 4, h: 2, tile: 2, opacity: 0.88, purpose: 'blank corkboard face', confidence: 'high' }
      ] },
    lunch: { src: 'assets/scenes/lunch.png', playerHeight: 78, perspective: { far: 0.75, near: 1 }, groundOffset: 16, start: { x: 20, y: 16 }, exit:{x:27,y:15}, bounds: { x0: 2, x1: 28, y0: 7, y1: 16 },
      hotspots: { cafe: { x: 5, y: 6 }, pause: { x: 23, y: 13 }, support: { x: 24, y: 8 } },
      surfaces: [
        { material: 'lunch_floor', x: 12, y: 11, w: 2, h: 2, tile: 2, opacity: 0.74, purpose: 'small floor gap between tables', confidence: 'medium' },
        { material: 'lunch_counter', x: 5, y: 8, w: 6, h: 2, tile: 2, opacity: 0.78, purpose: 'front face of the service counter', confidence: 'medium-high' }
      ] }
  }
};
