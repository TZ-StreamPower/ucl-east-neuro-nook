/* Team 6 playable concept. All characters, responses and campus layouts are illustrative hypotheses. */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('worldCanvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const TILE = 32;
  const CFG = window.TEAM6_ART || {};
  const MATERIAL_SURFACES_ENABLED = CFG.MATERIAL_SURFACES_ENABLED !== false;
  const ART = {debug:/[?&]debug=1/.test(location.search),spriteHeight:CFG.spriteHeight||72,scenes:CFG.scenes||{},sprites:CFG.sprites||{},imgs:{},ambientImages:{},ambientFrameBounds:{},materialImages:{},surfaceLayers:{},bounds:{}};
  const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const characters = [
    {id:'mei',name:'Mei',age:'22 · new postgraduate student',accent:'#d7744e',summary:'A visual thinker who likes a clear plan when several new systems arrive at once.',strengths:['Visual thinking','Organising a clear plan'],preferences:['Written steps','A route preview'],friction:'Unfamiliar systems and repeated explanations',focus:'Mei may spend energy finding reliable information and deciding what to do first.',factors:{uncertainty:1.35,noise:.85,social:1.05,light:.9},provisional:false},
    {id:'sam',name:'Sam',age:'19 · first-year undergraduate',accent:'#5877a9',summary:'A creative game-maker who wants to connect through shared interests.',strengths:['Game design','Shared interests'],preferences:['Clear event expectations','An easy way to leave'],friction:'Unspoken social rules, busy spaces and group roles',focus:'Sam may want to participate, while also needing clearer social expectations.',factors:{uncertainty:.95,noise:1.2,social:1.35,light:.9},provisional:false},
    {id:'leila',name:'Leila',age:'20 · provisional story character',accent:'#668967',summary:'A keen observer who enjoys photography and wants choice over where to pause.',strengths:['Noticing details','Photography'],preferences:['Lighting information','A choice of pause spaces'],friction:'Glare and sudden environmental changes',focus:'Leila is a design placeholder. Her story needs review with autistic students.',factors:{uncertainty:1,noise:1.15,social:.9,light:1.4},provisional:true}
  ];
  const materialSamples=[
    ['home_warm_oak_floor.png','Warm oak floor','Home'],['home_offwhite_wall.png','Off-white wall','Home'],
    ['park_paving_slabs.png','Paving slabs','Route'],['park_asphalt.png','Road asphalt','Route'],['playground_rubber_surface.png','Playground rubber','Route'],['refurbishment_hoarding_panel.png','Works hoarding','Route'],
    ['atrium_pale_stone_tile.png','Pale stone tile','Atrium'],['entrance_brushed_metal.png','Brushed metal','Atrium'],['entrance_escalator_rubber.png','Escalator rubber','Atrium'],['atrium_bench_wood_slats.png','Wood bench slats','Atrium'],
    ['project_space_desk_laminate.png','Desk laminate','Study space'],['project_space_blank_corkboard.png','Blank corkboard','Study space'],['library_sage_grey_carpet.png','Sage-grey carpet','Library'],['library_wood_shelf_panel.png','Wood shelf panel','Library'],
    ['cafe_floor_beige_tiles.png','Beige floor tiles','Café'],['cafe_counter_laminate.png','Counter laminate','Café']
  ].map(([file,label,place])=>({src:`assets/materials/${file}`,label,place,labelZh:({'Warm oak floor':'暖橡木地板','Off-white wall':'米白墙面','Paving slabs':'铺装石板','Road asphalt':'道路沥青','Playground rubber':'游乐区橡胶地面','Works hoarding':'施工围挡板','Pale stone tile':'浅色石材地砖','Brushed metal':'拉丝金属','Escalator rubber':'扶梯橡胶踏面','Wood bench slats':'木质长椅条板','Desk laminate':'书桌饰面板','Blank corkboard':'空白软木板','Sage-grey carpet':'灰绿色地毯','Wood shelf panel':'木质书架面板','Beige floor tiles':'米色地砖','Counter laminate':'柜台饰面板'})[label],placeZh:({'Home':'家','Route':'路线','Atrium':'中庭','Study space':'学习空间','Library':'图书馆','Café':'咖啡厅'})[place]}));

  // Fictional, character-specific reaction moments. These are not diagnostic or universal autism traits.
  const reactionTriggers={mei:{street:{1:'meiSensoryOverload',2:'meiHeadachePose'},park:{1:'meiSeatedRest',2:'meiSensoryOverload'}},sam:{cafe:{0:'samRequestPause'},group:{2:'samSocialUncertainty'},park:{1:'samRequestPause',2:'samRequestPause'}},leila:{seat:{1:'leilaGlareStepback'},pause:{0:'leilaSeatedPause'},support:{0:'leilaRequestHelp'},park:{1:'leilaSeatedPause',2:'tension'}}};
  const reactionCopy={
    headache:{title:{en:'Headache',zh:'头痛'},body:{en:'In this fictional moment, Mei pauses after several street sounds overlap. A headache is an individual experience, not a universal autistic experience.',zh:'在这个虚构片段中，街道上的几种声音交叠后，Mei 停下来缓一缓。头痛是个体体验，不代表所有自闭症人士。'}},
    soundPause:{title:{en:'Sound feels like too much',zh:'声音带来的不适'},body:{en:'Sam pauses briefly as several café sounds overlap. The image shows one possible response in this story, not a response shared by everyone.',zh:'咖啡厅里多种声音交叠时，Sam 暂停了一会儿。这只是故事中的一种可能反应，并非每个人都会如此。'}},
    glare:{title:{en:'Bright light is uncomfortable',zh:'强光让人不舒服'},body:{en:'Leila shades their eyes while asking whether the light can be adjusted. Leila is a provisional character who still needs review.',zh:'Leila 轻挡强光，同时询问能否调整灯光。Leila 仍是待验证的人物草稿。'}},
    lightheaded:{title:{en:'A brief light-headed pause',zh:'短暂头晕，停下来缓一缓'},body:{en:'In this version of the day, Leila feels briefly light-headed and pauses. This is an individual bodily response in a fictional scene, not a general autism symptom.',zh:'在这个版本的一天里，Leila 短暂感到头晕并停下来休息。这是虚构场景中的个体身体反应，不是普遍的自闭症症状。'}},
    fever:{title:{en:'Feeling feverish',zh:'感觉发热'},body:{en:'Sam feels feverish in this optional illness vignette. Fever is a separate health event, not an autism trait; the game does not diagnose or treat illness.',zh:'在这个可选的生病情境里，Sam 感觉发热。这是独立的健康事件，不是自闭症特征；游戏不会诊断或处理疾病。'}},
    fainting:{title:{en:'A fainting episode',zh:'晕厥情境'},body:{en:'This separate medical-event illustration shows Leila after fainting while a peer calls for help. Fainting has many possible causes and is not an autism trait.',zh:'这张独立的医疗事件插图描绘 Leila 晕厥后，同伴正在寻求帮助。晕厥可能有多种原因，不是自闭症特征。'}},
    fatigue:{title:{en:'Needing a rest',zh:'需要休息'},body:{en:'Mei sits down to rest after a demanding day. Fatigue can have many causes and varies from person to person; it is not a universal autistic experience.',zh:'忙碌的一天后，Mei 坐下来休息。疲惫可能有多种原因，而且因人而异，不代表所有自闭症人士都会如此。'}},
    quietPause:{title:{en:'Taking a quiet pause',zh:'找个安静时刻暂停一下'},body:{en:'Mei chooses a brief pause in a quieter place. This is one possible personal strategy; it is not a requirement or a universal autistic response.',zh:'Mei 选择到较安静的地方短暂停留。这是一种个人策略，不是要求，也不代表所有自闭症人士都会这样做。'}},
    nausea:{title:{en:'Nausea / stomach discomfort',zh:'恶心或胃部不适'},body:{en:'Sam feels nauseated in this separate health vignette. Nausea is not an autism trait, and this game does not diagnose or treat it.',zh:'在这个独立的身体不适情境中，Sam 感到恶心。恶心不是自闭症特征；游戏不会对此作出诊断或治疗。'}},
    tension:{title:{en:'Feeling tense',zh:'感到紧张'},body:{en:'Leila feels tense during an uncertain moment. This is an individual emotional response, not a universal autism symptom; Leila remains a provisional character.',zh:'在一个不确定的时刻，Leila 感到紧张。这是个体情绪反应，不是普遍的自闭症症状；Leila 仍是待验证人物。'}},
    meiSensoryOverload:{title:{en:'A sudden sound feels overwhelming',zh:'突如其来的声音带来感官过载'},body:{en:'An unexpected loud sound prompts Mei to cover her ears in this story. It is one fictional response, not a universal autistic reaction.',zh:'在这个故事里，突如其来的较大声音让 Mei 捂住耳朵。这是虚构的个体反应，不代表所有自闭症人士。'}},
    meiHeadachePose:{title:{en:'Pausing with a headache',zh:'头痛时停下来缓一缓'},body:{en:'This pose shows Mei taking a moment during an individual headache. Headaches have many possible causes and are not an autism trait.',zh:'这张姿势图表现 Mei 头痛时停下来缓一缓。头痛可能有多种原因，不是自闭症特征。'}},
    meiSeatedRest:{title:{en:'Sitting down to rest',zh:'坐下来休息'},body:{en:'Mei sits and rests after a demanding day. Rest needs vary between people; this is not a universal autistic experience.',zh:'忙碌的一天后，Mei 坐下来休息。每个人的休息需要不同，这不代表所有自闭症人士都会有相同体验。'}},
    samRequestPause:{title:{en:'Signalling for a pause',zh:'示意需要暂停'},body:{en:'Sam signals for a pause when a sound or busy moment feels like too much. Asking can be spoken, written or non-verbal; this image is only one possibility.',zh:'声音或周围环境让 Sam 感到吃力时，他示意暂停。提出暂停可以通过说话、文字或非语言方式；插图只是其中一种可能。'}},
    samSocialUncertainty:{title:{en:'Taking space in a group conversation',zh:'在小组交谈中拉开一点距离'},body:{en:'Sam steps back while working out what is happening in a group. People respond to social uncertainty in different ways.',zh:'Sam 在小组交谈中稍微退开，理清正在发生什么。面对社交不确定性，每个人的反应都可能不同。'}},
    samNauseaPose:{title:{en:'A nausea moment',zh:'感到恶心时的姿势'},body:{en:'This is a separate physical-health vignette, not an autism trait. The game does not diagnose or treat nausea.',zh:'这是独立的身体健康情境，不是自闭症特征。游戏不会诊断或治疗恶心。'}},
    leilaGlareStepback:{title:{en:'Stepping back from glare',zh:'避开强光'},body:{en:'Leila turns away and shields their eyes in this fictional bright-light moment. Sensory preferences differ from person to person.',zh:'在这个虚构的强光情境中，Leila 转身并用手挡光。每个人的感官偏好都不同。'}},
    leilaSeatedPause:{title:{en:'Choosing a seated pause',zh:'选择坐下来休息'},body:{en:'Leila chooses to sit down for a short break. This is a personal choice in this fictional scene, not a symptom or a universal response; Leila remains provisional.',zh:'Leila 选择坐下来短暂休息。这是虚构场景中的个人选择，不是症状，也不代表普遍反应；Leila 仍是待验证人物。'}},
    leilaRequestHelp:{title:{en:'Signalling a peer for help',zh:'举手向同伴求助'},body:{en:'Leila chooses to signal a peer after a difficult moment. Support should follow the person’s own choice; Leila remains provisional.',zh:'遇到困难后，Leila 选择向同伴示意求助。是否需要支持应由本人决定；Leila 仍是待验证人物。'}}
  };

  // A choice's values are illustrative game feedback. Positive load is adjusted by the selected character's context preference.
  const chapters = [
    {id:'morning',title:'The day begins at home',time:'08:00 · CHAPTER 1 OF 5',description:'A timetable, a room code and several ways to prepare. Decide what information matters to you.',scene:'home',start:{x:14,y:13},required:2,events:[
      {id:'schedule',x:7,y:5,icon:'▣',title:'The timetable',hint:'What do you know about today?',category:'uncertainty',text:'Today includes a morning class and a group task. The room code is visible, but it gives little sense of where the room is or what will happen there.',choices:[
        {label:'Make a short written plan',detail:'Keep the next two steps visible.',effect:{energy:0,focus:5,load:-3},reply:'You now have two clear next steps. The plan helps with information, although it cannot promise the day will stay the same.'},
        {label:'Check the room and class information',detail:'Find a description before leaving.',effect:{energy:0,focus:-4,load:-5},reply:'A room description helps you picture arrival. Looking across several pages also takes attention.'},
        {label:'Leave the plan flexible',detail:'Save effort now and decide later.',effect:{energy:2,focus:2,load:2},reply:'You save some effort now and keep the freedom to decide later. Some details remain unknown, and that is not a personal failure.'}
      ]},
      {id:'bag',x:21,y:8,icon:'◆',title:'Personal items',hint:'Choose what feels useful today.',category:'noise',text:'There is time to pack. A preferred object, headphones or just a lighter bag could each make sense for a different person.',choices:[
        {label:'Pack a preferred item',detail:'Take something familiar.',effect:{energy:-2,focus:2,load:-2},reply:'The item is available if you want it later. It is a personal strategy, not a universal solution.'},
        {label:'Pack headphones',detail:'Keep sound adjustment available.',effect:{energy:-1,focus:1,load:-3},reply:'You have an option for some noisy moments. Headphones may also make announcements harder to hear, so you can decide when to use them.'},
        {label:'Travel with a lighter bag',detail:'Keep physical effort lower.',effect:{energy:2,focus:-1,load:1},reply:'The bag feels easier to carry. The familiar item or headphones stay at home, and you can still ask for other support during the day.'}
      ]},
      {id:'preview',x:25,y:13,icon:'◇',title:'Route preview',hint:'Stratford to the campus.',category:'uncertainty',text:'A simple route preview shows an arrival point and two possible approaches. Neither route is labelled “best” for everyone.',choices:[
        {label:'Preview a direct route',detail:'Know the shortest illustrated route.',effect:{energy:2,focus:-2,load:-2},reply:'You can picture the direct approach. It might be busier at some times.'},
        {label:'Preview a route with a pause point',detail:'Find a possible place to stop.',effect:{energy:-2,focus:-2,load:-4},reply:'You know where you could pause. This illustrative route is not verified live navigation.'},
        {label:'Ask for a route description',detail:'Use words instead of a map.',effect:{energy:0,focus:1,load:-3},reply:'A text description makes the steps clearer for you. Different formats work for different people.'}
      ]}
    ]},
    {id:'route',title:'Through Stratford',time:'08:45 · CHAPTER 2 OF 5',description:'The route is familiar to some students and new to others. Explore information, sound and crowd choices.',scene:'route',start:{x:3,y:11},required:2,events:[
      {id:'station',x:6,y:8,icon:'▣',title:'Station information',hint:'An announcement is hard to catch.',category:'uncertainty',text:'A change is announced while people are moving past. The message is not clear from where you stand. A visual notice is nearby.',choices:[
        {label:'Read the notice',detail:'Check the change in writing.',effect:{energy:0,focus:-1,load:-2},reply:'The notice gives you the next step without a conversation. Reading and interpreting it still takes some attention.'},
        {label:'Ask a staff member to repeat it',detail:'Choose a direct conversation.',effect:{energy:0,focus:-2,load:-3},reply:'The staff member gives a concise answer and points to the sign. A useful response provides information without asking why you need it.'},
        {label:'Pause before deciding',detail:'Let the crowd pass first.',effect:{energy:-1,focus:1,load:-2},reply:'Waiting gives you time to check, while standing in the station uses some energy. You are still in control of when to move.'}
      ]},
      {id:'street',x:14,y:11,icon:'◇',title:'The busy crossing',hint:'Traffic and crowding change the route.',category:'noise',text:'Cars, conversation and a sudden horn overlap near the crossing. The scene describes the change in text; no loud sound is played.',choices:[
        {label:'Take the quieter illustrated path',detail:'More walking, potentially less crowding.',effect:{energy:-7,focus:-1,load:-7},reply:'The alternative path takes longer and uses physical energy. Its crowd level is only a design hypothesis until checked on site.'},
        {label:'Wait for a calmer crossing',detail:'Keep this route and change the timing.',effect:{energy:-1,focus:1,load:-5},reply:'The flow of people eases for a moment. Timing can be another choice when a route itself cannot change.'},
        {label:'Continue on the direct path',detail:'Keep the walk brief and move on.',effect:{energy:1,focus:-4,load:10},reply:'You reach the next point sooner and spend less effort on the walk. The overlapping activity may demand more attention in this version of the story.'}
      ]},
      {id:'park',x:24,y:7,icon:'◆',title:'Dog walkers near campus',hint:'A dog may bark unexpectedly; optional sound is off by default.',category:'noise',text:'On the path near campus, a passer-by walks a dog. The dog barks unexpectedly. The sound is described in text; an optional synthesized effect is off by default. People can respond to the same sound in different ways.',choices:[
        {label:'Take the quieter side path',detail:'Walk a little further to avoid the dog.',effect:{energy:-4,focus:0,load:-4},reply:'The side path takes more walking, but gives you distance from the dog. It is one option, not a required coping strategy.'},
        {label:'Pause and let them pass',detail:'Use the nearby bench or wait where you feel comfortable.',effect:{energy:1,focus:1,load:-3},reply:'You choose when to continue. Taking a pause is available without needing to explain or disclose anything.'},
        {label:'Continue along the main path',detail:'The dog barks as you pass; choose what feels manageable.',effect:{energy:-1,focus:-3,load:8},reply:'The unexpected bark asks for more attention in this version of the story. You can pause or change route at any time; there is no penalty for doing so.'}
      ]}
    ]},
    {id:'arrival',title:'Entering the campus',time:'09:20 · CHAPTER 3 OF 5',description:'An entrance, a brief exchange and a room number. Find a route that makes sense to you.',scene:'atrium',start:{x:14,y:15},required:2,events:[
      {id:'entry',x:15,y:11,icon:'◇',title:'The entrance',hint:'Several people arrive together.',category:'social',text:'The glass entrance is busy. You can enter now, take a moment outside or look for a clearer sign before walking in.',choices:[
        {label:'Follow the visible sign',detail:'Use the indicated entrance.',effect:{energy:-1,focus:0,load:1},reply:'The sign gives you a starting point. A clear route benefits more than one kind of visitor.'},
        {label:'Wait for space',detail:'Choose your arrival time.',effect:{energy:-2,focus:1,load:-4},reply:'Waiting gives the entrance time to clear, and uses some energy. You did not need to explain yourself to use this option.'},
        {label:'Ask where to go',detail:'Use a short question.',effect:{energy:0,focus:-2,load:-3},reply:'A person points to the correct door and describes the next turn. Specific directions are more helpful than “over there”.'}
      ]},
      {id:'reception',x:7,y:7,icon:'▣',title:'Reception exchange',hint:'How can someone respond?',category:'social',text:'A staff member asks which room you need. You can choose how much to say about your preference; you do not need to disclose a diagnosis.',choices:[
        {label:'Ask for the route in writing',detail:'“Could you show me the steps?”',effect:{energy:-1,focus:3,load:-4},reply:'The staff member writes two directions and checks the room number. The response follows the request without asking for a diagnosis.'},
        {label:'Ask for a landmark',detail:'“What should I look for?”',effect:{energy:0,focus:1,load:-2},reply:'The staff member first points “over there”. After you ask one follow-up, they name a landmark you can use with the room number.'},
        {label:'Check the map yourself',detail:'Keep the interaction brief.',effect:{energy:1,focus:-2,load:-1},reply:'You keep the exchange brief and find the map. Reading it takes attention, and asking for help remains available later.'}
      ]},
      {id:'room',x:24,y:6,icon:'◆',title:'Finding the room',hint:'A code needs context.',category:'uncertainty',text:'The room code is on your timetable, but the floors and corridors are new. A nearby sign and a teaching-room door offer different clues.',choices:[
        {label:'Follow a written floor guide',detail:'Use step-by-step information.',effect:{energy:-2,focus:1,load:-3},reply:'The guide connects the room code to a place. The route shown here is fictional and must not be used for real navigation.'},
        {label:'Ask a student ambassador',detail:'Get a human route description.',effect:{energy:-5,focus:2,load:-4},reply:'They name the floor and nearby landmark, then let you decide whether to walk with them. Asking someone directly takes extra effort for you today.'},
        {label:'Explore the corridor first',detail:'Build your own picture of the space.',effect:{energy:-3,focus:2,load:1},reply:'You learn landmarks by exploring and build your own picture of the space. It takes time and leaves some details uncertain.'}
      ]}
    ]},
    {id:'class',title:'Learning together',time:'10:00 · CHAPTER 4 OF 5',description:'A classroom, a group task and a change of plan. Notice how other people’s responses affect the day.',scene:'classroom',start:{x:15,y:15},required:2,events:[
      {id:'seat',x:7,y:8,icon:'◇',title:'A place in class',hint:'Light, sound and an available exit.',category:'light',text:'Some seats are nearer a bright window; others are closer to conversation. No seat is described as right for everyone.',choices:[
        {label:'Choose a seat with an easy exit',detail:'Keep movement possible.',effect:{energy:0,focus:2,load:-3},reply:'You know you can step out and return. The option makes participation easier for this version of the story.'},
        {label:'Ask whether the light can be adjusted',detail:'Make a specific request.',effect:{energy:0,focus:1,load:-5},reply:'The tutor checks what can be adjusted and offers another seat as well. The response keeps choice with the student.'},
        {label:'Sit near the group',detail:'Prioritise discussion access.',effect:{energy:0,focus:3,load:4},reply:'Conversation is easier to follow, while background activity may require more attention. Different priorities can coexist.'}
      ]},
      {id:'group',x:16,y:8,icon:'▣',title:'The group task',hint:'Roles have not been stated.',category:'social',text:'A group is asked to start, but nobody says who is doing what. A classmate asks, “Are we all okay to just begin?”',choices:[
        {label:'Ask for written roles and next steps',detail:'Make the task explicit.',effect:{energy:-2,focus:5,load:-5},reply:'A classmate writes the roles where everyone can see them. The group starts with a shared plan; coordinating that request takes a moment.'},
        {label:'Suggest a first small task',detail:'Start from your strength.',effect:{energy:0,focus:2,load:-2},reply:'The group accepts the first task, but roles for the rest of the activity stay unclear. You can decide whether to ask for another check-in.'},
        {label:'Observe before joining in',detail:'Take time to understand the task.',effect:{energy:2,focus:-2,load:2},reply:'You spend less effort speaking right away and take time to understand the task. A classmate checks later whether you want to take notes; some expectations remain unstated.'}
      ]},
      {id:'change',x:24,y:6,icon:'◆',title:'A room change',hint:'The afternoon location moves.',category:'uncertainty',text:'A notification changes the later activity location. It shows a new room code, but not the route or what happens if someone arrives late.',choices:[
        {label:'Request a route and updated time',detail:'Ask for the missing details.',effect:{energy:-2,focus:3,load:-5},reply:'A clear update arrives with a landmark and timing. Better information changes the situation for everyone, though arranging it takes a little time.'},
        {label:'Check with a classmate',detail:'Compare information together.',effect:{energy:0,focus:1,load:-3},reply:'You compare the message. The classmate offers help without assuming you cannot go on your own.'},
        {label:'Decide later whether to attend',detail:'Keep the option open.',effect:{energy:2,focus:1,load:1},reply:'You spend less effort on this conversation now and keep control of the next step. The event remains optional in this story.'}
      ]}
    ]},
    {id:'lunch',title:'Food, a pause and support',time:'12:30 · CHAPTER 5 OF 5',description:'Spaces can feel different at different times. Choose what helps, and decide what to communicate.',scene:'lunch',start:{x:14,y:14},required:2,events:[
      {id:'cafe',x:6,y:7,icon:'◇',title:'Where to eat',hint:'The café is busy today.',category:'noise',text:'There is conversation and movement around the café. You can eat here, choose another place or wait until the space changes.',choices:[
        {label:'Stay for lunch and ask for a pause if needed',detail:'Remain in the shared space without having to push through.',effect:{energy:3,focus:-3,load:6},reply:'You stay in the shared space and signal for a short pause as sounds overlap. Asking is a choice, not a requirement; the café itself has not changed.'},
        {label:'Find a less busy place',detail:'Change the setting.',effect:{energy:-2,focus:2,load:-6},reply:'A different space gives you more control. It took effort to find it, so clear space information would help.'},
        {label:'Return at another time',detail:'Change the timing.',effect:{energy:-1,focus:1,load:-4},reply:'The café may be easier for you later. Being able to choose when to participate matters.'}
      ]},
      {id:'pause',x:20,y:7,icon:'◆',title:'A place to pause',hint:'Rest is an available action.',category:'light',text:'An illustrated quieter area has a bench. Its real location and availability would need verification before anyone could rely on it.',choices:[
        {label:'Sit for a short break',detail:'Pause before the afternoon.',effect:{energy:2,focus:2,load:-3},reply:'A break helps in this fictional moment. It does not erase every demand or work the same way for everyone.'},
        {label:'Call or message someone you trust',detail:'Choose a personal connection.',effect:{energy:0,focus:4,load:-3},reply:'The conversation helps you feel connected. Support can come from relationships as well as spaces.'},
        {label:'Check the next plan',detail:'Use information to choose what comes next.',effect:{energy:-2,focus:5,load:-1},reply:'You know the next step, though checking it takes effort and does not provide a rest. You still choose how to use the information.'}
      ]},
      {id:'support',x:25,y:12,icon:'▣',title:'Share a preference',hint:'A communication card is optional.',category:'social',text:'A peer asks whether you want to join an afternoon activity. You can say what would help, ask for more information or keep your plans private.',choices:[
        {label:'Ask what the event involves',detail:'“How busy is it, and can I leave early?”',effect:{energy:-1,focus:4,load:-4},reply:'The peer describes the activity and confirms that leaving is fine. Clear expectations support a real decision, though asking and processing details can take effort.'},
        {label:'Share one preference',detail:'“Please message me if the room changes.”',effect:{energy:0,focus:3,load:-4},reply:'The peer agrees to send an update. You share only what you choose, without giving a diagnosis.'},
        {label:'Keep it private and decide later',detail:'You do not owe an explanation.',effect:{energy:2,focus:1,load:0},reply:'Your choice is respected. You do not have to decide in a live conversation; the invitation stays open without pressure.'}
      ]}
    ]}
  ];

  /* Draft, fictional inner thoughts are kept separate from participant quotes.
     Replace these strings with team-reviewed copy when it is supplied. */
  const thoughtDrafts={
    schedule:{mei:{en:'If I can see the next two steps, I can decide what to prepare first.',zh:'如果能先看到接下来的两步，我就能决定先准备什么。'},sam:{en:'I hope I know when the group task starts and what people expect from me.',zh:'我想先知道小组任务什么时候开始，以及大家对我的期待。'},leila:{en:'I want to know where the class is and what the morning will feel like.',zh:'我想知道教室在哪里，也想提前了解上午大概是什么节奏。'}},
    bag:{mei:{en:'I can choose one familiar thing that might help me feel settled.',zh:'我可以带一件熟悉的东西，让自己更安心一些。'},sam:{en:'I want to bring what I need without carrying extra things all day.',zh:'我想带上需要的东西，也不想一整天背得太重。'},leila:{en:'I will decide what is useful for me today; there is no universal kit.',zh:'我会按今天的需要来选，没有适合所有人的固定清单。'}},
    preview:{mei:{en:'A route with a place to pause may be more useful to me than the shortest route.',zh:'对我来说，知道哪里能停一下，可能比路线最短更有用。'},sam:{en:'I would like to know what I might pass and where I can ask for directions.',zh:'我想知道路上会经过什么，也想知道需要时可以去哪里问路。'},leila:{en:'A picture of the route helps me decide what feels manageable today.',zh:'先看到路线图，能帮我判断今天哪条路更适合自己。'}},
    station:{mei:{en:'I may have missed part of that announcement; I want another way to check.',zh:'我可能漏听了广播的一部分，想用另一种方式确认信息。'},sam:{en:'I can ask someone to repeat it, but I would like the written notice too.',zh:'我可以请人再说一遍，也希望旁边有书面通知。'},leila:{en:'Let me pause, look around and choose when I am ready to move.',zh:'让我先停一下、看看周围，再决定什么时候继续走。'}},
    street:{mei:{en:'Several sounds are happening at once; I want to choose whether to wait or detour.',zh:'好几种声音同时出现，我想自己决定等一等还是绕开。'},sam:{en:'The crowd is changing quickly. I want enough room to keep moving at my pace.',zh:'人流变化很快，我希望有空间按自己的节奏走。'},leila:{en:'The sudden noise caught my attention. I need a moment to work out what changed.',zh:'突如其来的声音吸引了我的注意，我需要一点时间弄清发生了什么。'}},
    park:{mei:{en:'A dog might bark without warning. I want to know where I could pause or take another path.',zh:'狗叫声可能突然出现。我想先知道哪里可以暂停，或者改走另一条路。'},sam:{en:'I would like space to choose whether to pass, wait, or take the side path.',zh:'我希望有空间决定是经过、等一等，还是走旁边的小路。'},leila:{en:'The same sound may feel different on different days. I can decide what works for me now.',zh:'同一种声音在不同日子里感受也可能不同。我可以按此刻的需要来决定。'}},
    entry:{mei:{en:'I want a clear entrance and a little space to decide when to go in.',zh:'我希望入口清楚，也希望有一点空间决定什么时候进去。'},sam:{en:'I am ready to enter, but I would rather not be pushed into the crowd.',zh:'我准备进去，但不想被人群推着走。'},leila:{en:'If I wait briefly, I can see where the flow of people is going.',zh:'如果稍等一下，我就能看清人群的行进方向。'}},
    reception:{mei:{en:'I can ask for the directions I need without explaining my whole story.',zh:'我可以直接询问路线，不必解释自己的全部情况。'},sam:{en:'A short, specific answer would help me get to the next step.',zh:'简短而具体的回答，会帮我知道下一步怎么走。'},leila:{en:'I want to choose how much I share and still get useful information.',zh:'我想自己决定分享多少，同时也能得到有用的信息。'}},
    room:{mei:{en:'A room code only helps once I can connect it to a floor and landmark.',zh:'只有知道楼层和地标，房间号对我才真正有用。'},sam:{en:'I can find the room more easily if someone tells me what to look for.',zh:'如果有人告诉我该找什么地标，我会更容易找到教室。'},leila:{en:'I want to explore, but I also need the option to ask for a clear route.',zh:'我想自己探索，也需要随时能询问清楚路线的选择。'}},
    seat:{mei:{en:'I want to pick a seat that works for me today, not be told there is one right seat.',zh:'我想选一个今天适合自己的座位，而不是被告知只有一个正确位置。'},sam:{en:'I would like to hear the group, while keeping a clear way to step out.',zh:'我想听清小组讨论，也希望知道需要时怎样离开一下。'},leila:{en:'The light may feel different later, so I want to know what can be adjusted.',zh:'之后光线可能会变化，我想知道哪些地方可以调整。'}},
    group:{mei:{en:'Clear roles would let me focus on the task instead of guessing the rules.',zh:'分工明确后，我就能专心做任务，不用猜规则。'},sam:{en:'I have ideas to share; it helps when the group leaves room for different ways to join.',zh:'我有想法想分享；如果小组允许不同的参与方式，会更容易加入。'},leila:{en:'I would like to know whether I can contribute by writing or organising.',zh:'我想知道能不能通过记录或整理来参与。'}},
    change:{mei:{en:'If the room changes, I need the new route and timing together.',zh:'如果教室换了，我需要同时知道新路线和时间。'},sam:{en:'I want to check the change with someone without being made to feel behind.',zh:'我想和别人确认变更，但不想因此觉得自己落后了。'},leila:{en:'A little notice would help me adjust my plan at my own pace.',zh:'如果能提前一点通知，我就能按自己的节奏调整计划。'}},
    cafe:{mei:{en:'I want to compare a few options before choosing where to eat.',zh:'我想先看看几个选择，再决定在哪里吃饭。'},sam:{en:'I would like company, but I also want an easy way to choose a quieter spot.',zh:'我想和别人一起吃，也希望能轻松选择安静些的地方。'},leila:{en:'The room feels busy right now. I can wait or find another place.',zh:'这里现在有些热闹，我可以等一等，也可以换个地方。'}},
    pause:{mei:{en:'A short break might help me plan what I want to do next.',zh:'短暂休息一下，可能能帮我想好接下来做什么。'},sam:{en:'I can message someone or sit quietly; I do not have to choose the same thing every day.',zh:'我可以给信任的人发消息，也可以安静坐会儿；每天的需要都可能不同。'},leila:{en:'I want the choice to pause without having to justify it.',zh:'我希望可以选择休息，不必为这个选择解释。'}},
    support:{mei:{en:'I can share one practical preference and keep the rest private.',zh:'我可以只分享一个实际偏好，其他信息留给自己。'},sam:{en:'Knowing what the invitation involves helps me decide if I want to join.',zh:'先知道邀请的活动是什么，能帮我决定要不要参加。'},leila:{en:'I can ask for more information now and decide later.',zh:'我可以先问清楚，再晚些时候决定。'}}
  };
  const actionByEvent={schedule:'examine',bag:'pickup',preview:'examine',station:'examine',street:'look',park:'rest',entry:'look',reception:'wave',room:'examine',seat:'rest',group:'wave',change:'phone',cafe:'look',pause:'look',support:'wave'};
  chapters.forEach(ch=>ch.events.forEach(event=>{event.thought=thoughtDrafts[event.id]||{};event.action=actionByEvent[event.id]||'';}));

  const zhStory={
    chapters:{
      morning:{title:'一天从家中开始',time:'08:00 · 第 1 章 / 共 5 章',description:'课表、房间信息和几种准备方式。先决定哪些信息对你有帮助。'},
      route:{title:'穿过 Stratford',time:'08:45 · 第 2 章 / 共 5 章',description:'有人熟悉这条路，也有人刚刚开始了解。看看路线、声音与人流带来哪些选择。'},
      arrival:{title:'进入校园',time:'09:20 · 第 3 章 / 共 5 章',description:'入口、简短交流和教室编号。找到一种适合自己的进入方式。'},
      class:{title:'一起学习',time:'10:00 · 第 4 章 / 共 5 章',description:'课堂、小组任务和计划变更。留意他人的回应如何影响这一天。'},
      lunch:{title:'午餐与暂停',time:'12:30 · 第 5 章 / 共 5 章',description:'午餐、人际邀请和休息选择。你可以决定分享多少，也可以暂时不分享。'}
    },
    events:{
      schedule:{title:'今天的课表',hint:'你目前知道些什么？',text:'今天有一节上午的课和一次小组任务。课表显示了教室编号，却没有说明教室在哪里或课堂会怎样进行。',choices:[['写下简短计划','把接下来的两步记下来。','现在能看到两个清楚的下一步。计划能帮助整理信息，但不保证一天不会变化。'],['查看教室与课程信息','离开前先了解一下情况。','教室介绍让你能提前想象到达后的情形。浏览多个页面也会花费注意力。'],['先不做计划','省下眼下的精力，之后再决定。','你省下眼下的精力，也保留了稍后决定的空间。有些细节暂时未知，这不是个人的失败。']]},
      bag:{title:'随身物品',hint:'选出今天可能用得上的东西。',text:'出门前还有一点时间。带上熟悉的物品、耳机，或让包轻一点，都可能适合不同的人。',choices:[['带一件熟悉的物品','需要时可以拿出来。','如果之后想用，这件物品就在身边。这是个人策略，不是适合所有人的办法。'],['带上耳机','为调整声音留个选项。','遇到嘈杂环境时，你多了一种选择。使用耳机也可能听不清广播，可以自行决定何时使用。'],['轻装出门','减少整天背包的负担。','包轻了一些。一天中仍然可以选择其他支持方式。']]},
      preview:{title:'提前看看路线',hint:'从 Stratford 前往校园。',text:'简图标出了到达位置和两种可能的走法。这里没有把任何一条路线标成“人人最适合”。',choices:[['查看直接路线','了解图示中的较短路线。','你能提前想象直接前往的路径。某些时段这里可能更热闹。'],['查看有暂停点的路线','找一处可能停下来的地方。','你知道途中哪里可以暂停。这里仅为示意，并非实时导航。'],['询问文字路线说明','用文字了解行走步骤。','文字说明把步骤说得更清楚。不同的人可能需要不同的信息形式。']]},
      station:{title:'车站信息',hint:'广播不太容易听清。',text:'人群经过时，广播里提到了变化，但你站的位置不太容易听清。旁边有一张视觉提示。',choices:[['阅读提示','用文字确认变化。','提示告诉你下一步，无需进行对话。阅读和理解内容仍要花一些注意力。'],['请工作人员再说一遍','选择直接询问。','工作人员简短地说明情况并指向提示牌，没有追问你为什么需要帮助。'],['先停一下再决定','等人群过去一些。','稍等让你有时间确认。什么时候继续走仍由你决定。']]},
      street:{title:'繁忙的路口',hint:'车流和人群让路线变得不一样。',text:'路口附近，汽车、谈话声和一声突然的鸣笛重叠在一起。这里用文字描述变化，不播放突发声音。',choices:[['走图示中的较安静路线','多走一段，可能少些人群。','绕行需要更多体力，也可能少些拥挤。人流描述仍是设计假设，需要现场核实。'],['等一等再过路口','保留这条路线，调整时间。','人流暂时少了一些。路线不变时，调整时间也可以是一种选择。'],['沿直接路线继续','缩短步行，继续往前。','你更快到达下一处，也少花一些步行精力。这个故事版本里的重叠活动可能需要更多注意力。']]},
      park:{title:'校园附近的遛狗人',hint:'狗可能突然叫；可选音效默认关闭。',text:'校园附近的路上，有人牵着狗经过。狗突然叫了一声。这里会用文字描述；可选合成音效默认关闭。不同的人对同一种声音可能有不同反应。',choices:[['走旁边较安静的小路','多走一段，和狗拉开距离。','绕行会多走一段路，但能和狗拉开距离。这只是一种选择，不是必须采用的应对方式。'],['停下来等他们经过','在长椅旁休息，或停在让你舒服的位置。','你可以自行决定什么时候继续，不必解释或透露任何个人信息。'],['沿主路继续前行','经过时狗叫了；选择自己觉得能应对的方式。','在这个故事片段里，突如其来的狗叫需要更多注意力。你随时可以停下或换路，不会因此受到惩罚。']]},
      entry:{title:'校园入口',hint:'几个人同时到达。',text:'玻璃入口附近比较忙。你可以现在进去、在外面等一下，或先看看有没有更清楚的指引。',choices:[['跟随看得见的指引','从标出的入口开始。','指引给你一个起点。清楚的路线信息对许多访客都有帮助。'],['等入口空一点','自己选择进入的时间。','入口稍微空了一些。使用这个选项不需要向别人解释。'],['询问该往哪里走','用一句简短的问题。','对方指了指门，并说明接下来转向哪里。具体的路线比“在那边”更有用。']]},
      reception:{title:'前台交流',hint:'工作人员问你要去哪个房间。',text:'工作人员问你要找哪个房间。你可以决定说明多少自己的偏好；无需透露诊断。',choices:[['请对方写下路线','“可以把步骤写给我吗？”','工作人员写下两个方向并核对房间号。回应了你的请求，也没有要求你说明诊断。'],['询问明显地标','“我应该找什么标志？”','工作人员说了一个清楚的地标。你可以结合房间号一起确认。'],['自己查看地图','让交流保持简短。','你让交流保持简短并找到地图。读图需要花些注意力，之后仍然可以选择向别人询问。']]},
      room:{title:'找到教室',hint:'编号还需要一些背景信息。',text:'课表上有房间编号，但楼层和走廊还不熟悉。附近的楼层指引和教学门口都提供了一些线索。',choices:[['查看楼层指引','按步骤确认路线。','指引把房间编号和位置联系起来。这里的路线是虚构示意，不能用于实际导航。'],['询问学生大使','获得口头路线说明。','询问学生大使需要花一些精力。对方说了楼层和附近地标，并让你自行决定要不要一起走。'],['先熟悉走廊','自己看看周围环境。','你通过探索逐渐认识地标，也形成自己的空间印象。这需要时间，有些细节仍可能不确定。']]},
      seat:{title:'课堂里的座位',hint:'光线、声音和离开方式。',text:'有些座位靠近明亮的窗户，另一些更靠近谈话声。没有哪个座位适合所有人。',choices:[['选一个方便离开的座位','保留行动空间。','你知道需要时可以出去再回来。这个选项让故事里的参与更容易一些。'],['询问能否调整光线','提出一个具体请求。','导师查看了可以调整的部分，也提供了另一个座位。选择仍在学生手里。'],['坐在小组旁边','优先听清讨论。','你更容易跟上谈话，但周围活动也可能需要更多注意力。不同需求可以同时存在。']]},
      group:{title:'小组任务',hint:'还没人说明分工。',text:'大家被请来开始任务，却没人说明谁负责什么。一位同学问：“我们现在直接开始吗？”',choices:[['请大家写下分工和步骤','让任务安排更明确。','同学把分工写在大家都能看见的地方。小组有了共同的起点。'],['提出一件小任务','从自己擅长的部分开始。','小组接受了一个清楚的起点。发挥优势可以帮助参与，不需要先解释诊断。'],['先观察一会儿','花时间理解任务。','你暂时少花一些开口交流的精力，先理解任务。之后仍然可以加入讨论。']]},
      change:{title:'教室临时变更',hint:'下午活动换了地点。',text:'通知说下午的活动更换了教室，只给了新的房间号，没有写路线，也没说迟到后该怎么办。',choices:[['询问路线和新时间','确认缺少的细节。','工作人员补上了路线和时间，也说明迟到后该怎么加入。'],['请同学发消息确认','找一个熟悉的人核对。','同学发来简短的文字说明。你只分享了需要确认的信息。'],['先继续当前安排','稍后再处理地点变化。','你现在不用投入精力继续询问，可以先完成手头的事。之后仍可以查看更新信息或寻求协助。']]},
      cafe:{title:'咖啡厅午餐',hint:'人声、设备声和座位都在变化。',text:'咖啡厅里有人聊天，设备也在发出声音。几张桌子有人坐着；另一个角落相对安静。',choices:[['先看看食物和座位','了解选项后再决定。','你先了解有什么可选。慢一点决定也是一种选择。'],['和熟悉的同学一起坐','选择有人陪伴的座位。','同学说明了大致安排。你也保留了之后换地方的空间。'],['在安静角落吃','找一处更少人经过的位置。','安静角落可能更适合此刻的你。它不一定适合每个时刻或每个人。']]},
      pause:{title:'暂停一下',hint:'午餐后还有一段时间。',text:'接下来的安排还没开始。你可以休息、给信任的人发消息，或查看下一步信息。',choices:[['坐一会儿再继续','留一点缓冲时间。','你有时间慢下来。是否暂停由你自己决定。'],['给信任的人发消息','寻求陪伴或确认。','你按自己的方式联系了一个人。支持可以来自不同关系。'],['查看下一步安排','先确认后面的活动。','你知道接下来要去哪里；查看信息需要花一些精力，也不能代替休息。如何使用这些信息仍由你决定。']]},
      support:{title:'分享一个偏好',hint:'沟通卡是可选的。',text:'同学问你要不要参加下午活动。你可以说出需要什么、先多问一点，也可以保留自己的计划。',choices:[['先问活动会是什么样','“会很热闹吗？我可以提前离开吗？”','同学说明活动情况，也确认你可以提前离开。清楚的预期让你能自己决定；询问和处理更多细节也会花一些精力。'],['说出一个实际偏好','“如果换房间，请发消息告诉我。”','同学同意发更新。你只分享了自己愿意说的内容，没有提供诊断。'],['暂时不分享，晚点再决定','你不欠任何人一个解释。','你的选择得到尊重。你不必在对话中立刻作答；邀请仍然开放，没有人催你回答。']]}
    }
  };
  const personaReplies={
    en:{mei:{street:{0:'Mei checks the longer option against the available time before deciding. The route card helps make that trade-off visible.'},group:{0:'The group adds a written role list. Mei chooses one task from it and keeps the steps visible.'},support:{1:'The peer agrees to send a written update. Mei chooses to share only this practical preference.'}},sam:{street:{2:'Sam chooses the direct route and keeps moving, while leaving a quieter alternative available for another day.'},group:{1:'The group agrees to start with Sam’s task, but the remaining roles stay unclear. Sam can ask what comes next or hold the first task.'},support:{0:'The peer explains the event and the option to leave early. Sam can decide without committing on the spot.'}},leila:{street:{1:'Leila waits until the sudden noise has passed, then checks whether the crossing feels manageable.'},group:{2:'The group starts before roles are clear. A classmate later asks whether Leila wants to keep notes; she can join without explaining, while other roles remain open.'},support:{2:'The peer accepts Leila’s decision to respond later and does not ask for a reason.'}}},
    zh:{mei:{street:{0:'Mei先结合可用时间比较绕行与直行。路线卡让这项取舍更清楚。'},group:{0:'小组写下分工后，Mei从中挑选一项任务，并把步骤留在眼前。'},support:{1:'同学同意用文字发送更新。Mei只分享了这一项实际偏好。'}},sam:{street:{2:'Sam选择沿直接路线继续，同时知道更安静的选项也可以留给另一天。'},group:{1:'小组同意先从Sam提出的任务开始，但其他分工仍不明确。Sam可以追问下一步，也可以先完成眼前的任务。'},support:{0:'同学说明了活动情况和提前离开的选择。Sam可以不必马上承诺。'}},leila:{street:{1:'Leila等突发声过去后，再确认这个路口是否适合自己通过。'},group:{2:'小组在分工尚不清楚时就开始了。之后有同学问Leila是否愿意记录；她可以不作解释直接加入，其他分工仍待商量。'},support:{2:'同学接受Leila晚些再决定，没有追问原因。'}}}
  };
  const responderResponses={
    en:{reception:['The staff member writes clear steps.','A follow-up question is needed to get a usable landmark.','You choose a self-directed map check.'],group:['The group makes roles visible.','The first task is agreed, but later roles remain unclear.','The group starts before clarifying roles; a classmate checks in later.'],support:['The peer gives a broad answer; a follow-up confirms the leave option.','The peer agrees to send the update.','Your choice to keep the detail private is respected.']},
    zh:{reception:['工作人员写下了清楚的步骤。','需要追问一次，才能得到可用的地标信息。','你选择自己查看地图。'],group:['小组把分工写清楚了。','大家同意了第一项任务，后续分工仍不清楚。','小组在分工未明时开始；之后有同学来确认你是否需要参与。'],support:['同学先给了概括答复；追问后才确认可以提前离开。','同学同意发送文字更新。','你选择暂不分享后，对方尊重了这个决定。']}
  };

  /* Individual draft thoughts for each moment. These are design copy, never interview quotes. */
  const personaThoughts={
    schedule:{mei:['I want the room and next steps somewhere I can see them.','我想把教室和接下来的步骤写在能看见的地方。'],sam:['I want to know what the group task involves, not just when it starts.','我想知道小组任务要做什么，而不只是几点开始。'],leila:['I want to check what might change before I head out.','出门前我想先看看今天哪些安排可能会变。']},
    bag:{mei:['A familiar item and a lighter bag help in different ways.','熟悉的物品和轻一点的包各有用处。'],sam:['Headphones might help, but I still need to hear useful announcements.','耳机也许有用，但我还需要听清重要通知。'],leila:['I want something I can use in my own way, without explaining why.','我想带上自己用得惯的东西，不必解释原因。']},
    preview:{mei:['A clear route description helps me compare the steps.','清楚的路线说明能帮我比较每一步。'],sam:['The shorter route and the quieter route may ask different things of me.','短路线和安静一点的路线，对我的要求可能不一样。'],leila:['I want to know where I could pause if the surroundings change.','我想先知道环境变化时可以在哪里停一下。']},
    station:{mei:['A written update lets me check the details at my own pace.','文字更新能让我按自己的节奏确认细节。'],sam:['I need to catch the change before I follow the crowd.','我得先听懂变化，再决定要不要跟着人群走。'],leila:['I can wait a moment or ask; I do not have to guess.','我可以等一下，也可以询问，不必靠猜。']},
    street:{mei:['I want to weigh the extra walking against the noise and crowd.','我想比较多走一段路和面对噪声、人流各自的影响。'],sam:['A horn and a crowd arrive together. I want room to choose my pace.','鸣笛和人群同时出现时，我想留出空间按自己的节奏走。'],leila:['I need a moment to notice what is changing around me.','我需要一点时间留意周围发生了什么变化。']},
    park:{mei:['That bark came suddenly. I want to choose whether to pause or move.','狗叫来得很突然。我想自己决定暂停还是继续走。'],sam:['I want a little space before I decide how to pass.','我想先留出一点距离，再决定怎么经过。'],leila:['The sudden sound caught my attention; I can take another route.','突如其来的声音吸引了我的注意，我也可以换一条路。']},
    entry:{mei:['I want to see the entrance and the next step before I join the flow.','进入人流前，我想先看清入口和接下来的方向。'],sam:['I can wait for a gap or ask someone what happens next.','我可以等人少一点，也可以问问接下来怎么走。'],leila:['A clear sign would help me settle into this new space.','清楚的指引能帮我慢慢适应这个新空间。']},
    reception:{mei:['A written route would let me check it again later.','把路线写下来，我之后还能再确认。'],sam:['I want a direct answer without having to explain my whole day.','我想得到直接的回答，不必解释自己的一整天。'],leila:['I want to ask for the detail I need and keep other things private.','我想只询问自己需要的信息，其他事情可以保留。']},
    room:{mei:['A room number is easier to use when it has a floor and landmark.','房间号如果配上楼层和地标，会更容易使用。'],sam:['I want to arrive without having to ask several people.','我想尽量一次弄清楚，不用连续问好几个人。'],leila:['I can explore, follow a guide or ask; I can choose what fits now.','我可以自己找、看指引或询问，再选此刻合适的方式。']},
    seat:{mei:['I want a seat where I can follow the task and leave if I need a pause.','我想坐在能跟上任务、需要时也方便暂停的位置。'],sam:['Being near the group may help me join in; the other sounds still matter.','坐得靠近小组也许更容易参与，周围的声音同样重要。'],leila:['The light and the way out both matter to where I sit.','座位附近的光线和离开的路线都很重要。']},
    group:{mei:['Writing down the roles would make the next steps easier to hold onto.','把分工写下来，我会更容易记住接下来的步骤。'],sam:['I want to contribute through something I know, with the roles clear.','我想从熟悉的事情开始参与，也希望分工说得清楚。'],leila:['I would like time to understand the group before choosing a role.','选任务前，我想先花一点时间弄清楚小组在做什么。']},
    change:{mei:['A room change needs a route and a time, not just a new code.','教室变更时，我需要路线和时间，不只是一个新编号。'],sam:['I want to know whether the group plan still works in the new room.','我想知道换到新教室后，小组安排还能不能照常进行。'],leila:['I need to decide whether to ask now or return to this update later.','我需要决定现在询问，还是晚一点再处理这条更新。']},
    cafe:{mei:['I want to check the seating before choosing where to eat.','决定在哪里吃之前，我想先看看座位情况。'],sam:['I would like to stay connected, and still have a way to step out.','我想和大家保持联系，也希望保留暂时离开的办法。'],leila:['I want to notice the light and find a place that feels manageable.','我想留意光线，再找一个自己能接受的位置。']},
    pause:{mei:['Rest and checking the plan are both useful, but they are not the same.','休息和查看计划都可能有用，但它们不是一回事。'],sam:['I can contact someone, pause by myself or check what comes next.','我可以联系别人、自己暂停，或先看看接下来的安排。'],leila:['I want to choose how much contact or quiet I need right now.','我想自己决定现在需要安静，还是需要和别人联系。']},
    support:{mei:['I can ask for a written update without sharing a diagnosis.','我可以要求文字更新，不必分享诊断信息。'],sam:['I want to know what the event is like before I decide to join.','决定参加前，我想先知道活动大概是什么样。'],leila:['I can share one preference, ask for details or decide later.','我可以说出一个偏好、先问细节，或之后再决定。']}
  };

  // Short, illustrative scene cues shown automatically when a player approaches a moment.
  // These describe the setting, not a universal autistic response.
  const momentCueCopy={
    schedule:{en:'The timetable shows a room code, but not what arrival will be like.',zh:'课表显示了房间编号，却没有说明抵达后会是什么样。'},
    bag:{en:'Several personal items could be useful today; what to bring is your choice.',zh:'今天可能用得上的物品有好几种；带什么由你决定。'},
    preview:{en:'The route has more than one approach. This map is illustrative, not live navigation.',zh:'这里有不止一种走法。地图只是情境示意，不是实时导航。'},
    station:{en:'An announcement is difficult to catch while people move around.',zh:'人群移动时，广播内容不容易听清。'},
    street:{en:'Traffic, conversation and sudden sounds may overlap near the crossing.',zh:'路口附近可能有车流、交谈和突发声音交叠。'},
    park:{en:'A dog and a moving crowd are nearby. Sound stays off unless you opt in.',zh:'附近有遛狗的人和流动人群。除非你主动开启，游戏不会播放声音。'},
    entry:{en:'People arrive together; signs and the flow through the entrance may be unclear.',zh:'人们集中到达时，入口指引和通行方向可能不够清楚。'},
    reception:{en:'A room number may need a floor or landmark to become useful directions.',zh:'只有房间号可能不够，还需要楼层或地标才能找到方向。'},
    room:{en:'The room code alone does not show the route through the building.',zh:'房间编号本身没有说明如何穿过这栋楼。'},
    seat:{en:'Light, nearby sound and the way out can all shape a seat choice.',zh:'座位选择可能会受到光线、周围声音和出口位置影响。'},
    group:{en:'The group task is starting, but roles may not yet be clear.',zh:'小组任务开始了，但每个人的分工可能还不清楚。'},
    change:{en:'A room change brings new route and timing information to work out.',zh:'换教室后，还需要重新确认路线和时间。'},
    cafe:{en:'Light, conversation and music may overlap in this shared space.',zh:'这个共享空间里，灯光、交谈和音乐可能同时出现。'},
    pause:{en:'You can pause, contact someone or check what happens next.',zh:'你可以暂停、联系熟悉的人，或先查看接下来的安排。'},
    support:{en:'The activity expectations are not fully clear. Sharing a preference is optional.',zh:'活动的具体安排还不完全清楚；是否分享个人偏好由你决定。'}
  };

  function continuityNote(eventId){
    const target=chronologicalEvents.findIndex(x=>x.event.id===eventId);if(target<=0)return '';
    const {chapterId,event}=chronologicalEvents[target-1],record=state.done[`${chapterId}:${event.id}`];
    if(!record||isStaleRecord(event.id,record))return '';
    const spec=branchSpec[state.character]?.[event.id]?.[record.choiceIndex]?.[state.language];
    return spec?.downstream?.[0]?.event===eventId?spec.downstream[0].text:'';
  }

  function localizedChapter(base=chapter()){
    const zh=state.language==='zh',tr=zh?zhStory.chapters[base.id]:null;
    return {...base,...(tr||{}),events:base.events.map(event=>{
      const copy=zh?zhStory.events[event.id]:null;
      const translated=copy?{...event,title:copy.title,hint:copy.hint,text:copy.text,choices:event.choices.map((choice,index)=>({...choice,label:copy.choices[index][0],detail:copy.choices[index][1],reply:copy.choices[index][2]}))}:{...event,choices:event.choices.map(choice=>({...choice}))};
      const replies=personaReplies[state.language]?.[state.character]?.[event.id];
      if(replies)Object.entries(replies).forEach(([index,reply])=>translated.choices[Number(index)].reply=reply);
      const isZh=state.language==='zh';
      if(event.id==='room'){
        const prior=state.done['arrival:reception']?.choiceIndex;
        if(prior===0){translated.choices[0].label=isZh?'沿用前台写下的路线':'Use the written route from reception';translated.choices[0].detail=isZh?'按前面拿到的步骤寻找教室。':'Follow the steps you received earlier.';translated.choices[0].reply=isZh?'你沿用前台写下的路线，把房间编号和楼层、走廊联系起来。路线仍是虚构示意，不用于实际导航。':'You use the route written by reception to connect the room code with a floor and corridor. The route remains illustrative, not live navigation.'}
        if(prior===1){translated.choices[1].label=isZh?'跟随前台提供的地标':'Follow the landmark from reception';translated.choices[1].detail=isZh?'用刚才确认的地标来判断方向。':'Use the landmark you confirmed earlier.';translated.choices[1].reply=isZh?'你用前台提供的地标来确认方向，并结合房间编号寻找教室。路线仍是虚构示意，不用于实际导航。':'You use the landmark named by reception to orient yourself alongside the room code. The route remains illustrative, not live navigation.'}
      }
      if(event.id==='change'&&state.done['class:group']?.choiceIndex===0){translated.choices[1].label=isZh?'对照小组写下的任务安排':'Check the written group plan';translated.choices[1].detail=isZh?'确认换教室后谁做什么。':'Confirm who is doing what in the new room.';translated.choices[1].reply=isZh?'你和同学对照前面写下的分工，确认换教室后各自做什么。':'You and a classmate compare the earlier written roles and confirm who is doing what after the room change.'}
      if(event.id==='support'&&state.done['lunch:pause']?.choiceIndex===1){translated.choices[1].label=isZh?'继续用文字告诉熟悉的人':'Message the person you contacted earlier';translated.choices[1].detail=isZh?'沿用前面已经选择的沟通方式。':'Continue with the communication method you chose earlier.';translated.choices[1].reply=isZh?'你沿用午间选择的文字方式联系熟悉的人，也只分享自己愿意说的内容。':'You continue with the written contact you chose at lunch and share only what you want to.'}
      if(event.id==='cafe'){
        const cafeOptions=zh?[
          ['留在咖啡厅，需要时示意暂停','留在共享空间；如果需要，可以示意想暂停一下。'],
          ['换到人少一些的地方','改变地点，找一个此刻更合适的环境。'],
          ['改个时间再来','先离开，之后再决定是否回来。']
        ]:[
          ['Stay for lunch and signal for a pause if needed','Remain in the shared space; you can signal for a pause if you want one.'],
          ['Find a less busy place','Change the setting to a place that feels more manageable now.'],
          ['Return at another time','Leave for now and decide later whether to come back.']
        ];
        translated.choices=translated.choices.map((choice,index)=>({...choice,label:cafeOptions[index][0],detail:cafeOptions[index][1]}));
      }
      return translated;
    })};
  }

  /* One data record for every persona × event × story choice. UI interactions use
     shared mechanics, while prompts, responses, actions and consequences are
     contextualized for the selected person and moment. */
  const interactionTypes={
    schedule:['ARR','READ','MSG'],bag:['PLC','CARD','LOOK'],preview:['NODE','ARR','READ'],
    station:['READ','ASK','LOOK'],street:['NODE','SEAT','LOOK'],park:['NODE','SEAT','ASK'],
    entry:['LOOK','SEAT','ASK'],reception:['ASK','READ','LOOK'],room:['NODE','ASK','LOOK'],
    seat:['SEAT','ASK','LOOK'],group:['CARD','ASK','LOOK'],change:['READ','MSG','LOOK'],
    cafe:['LOOK','SEAT','MSG'],pause:['SEAT','MSG','READ'],support:['ASK','CARD','MSG']
  };
  const postActions={
    schedule:['notebook','examine','look'],bag:['pickup','notebook','look'],preview:['examine','look','notebook'],
    station:['examine','wave','rest'],street:['look','rest','examine'],park:['look','chair','rest'],
    entry:['look','rest','wave'],reception:['notebook','wave','examine'],room:['examine','wave','look'],
    seat:['chair','wave','look'],group:['notebook','wave','look'],change:['phone','notebook','look'],
    cafe:['look','chair','phone'],pause:['rest','phone','examine'],support:['wave','notebook','look']
  };
  const branchFlags={
    schedule:['plan.written','plan.reviewed','plan.flexible'],bag:['bag.familiar','bag.audio','bag.light'],
    preview:['route.direct','route.pause','route.text'],station:['info.notice','info.person','info.wait'],
    street:['street.detour','street.timing','street.direct'],park:['park.sidepath','park.pause','park.main'],
    entry:['entry.sign','entry.wait','entry.ask'],reception:['recep.writtenRoute','recep.landmark','recep.map'],
    room:['room.guide','room.ambassador','room.explore'],seat:['seat.exit','seat.light','seat.group'],
    group:['group.roles','group.firstTask','group.observe'],change:['change.staff','change.peer','change.defer'],
    cafe:['cafe.stay','cafe.quieter','cafe.return'],pause:['pause.rest','pause.message','pause.plan'],
    support:['support.asked','support.preference','support.later']
  };
  const interactionCopy={
    en:{
      ARR:{prompt:'Put the next useful cues in an order that works for you.',options:['Place the next step first','Place the people or place detail first','Keep both cues together'],feedback:['The first cue is now easy to spot.','You have foregrounded the detail you want to check.','You kept the information together without ranking it.']},
      PLC:{prompt:'Choose what, if anything, you want within reach for this moment.',options:['Keep a written cue nearby','Keep a familiar item nearby','Go without an extra item'],feedback:['The note stays available if you want to check it.','The item is an option, not something you have to use.','You keep your hands free; you can still change your mind.']},
      NODE:{prompt:'Mark one point that could help you decide what to do next.',options:['Mark the direct way','Mark a place to pause','Mark a place to ask or check'],feedback:['You marked the shorter illustrated way.','You added a possible pause point.','You marked an information point; this is not live navigation.']},
      READ:{prompt:'Open the information card, then choose which detail to keep in view.',options:['Keep the room or route detail','Keep the time or next step','Close the card and decide later'],feedback:['That detail remains visible in this moment.','The next step is easier to refer back to.','You leave the information for later; nothing is lost.']},
      ASK:{prompt:'Choose a short phrase to try. The reply is a fictional example, not a promise about staff or peers.',options:['“Could you tell me the next step?”','“Could you show or write that down?”','“Not now, thank you.”'],feedback:['The person gives one concrete next step.','The person responds with a written or visual cue.','The person accepts the pause and leaves the choice open.']},
      LOOK:{prompt:'Take a moment to scan the scene. What do you want to check first?',options:['Look for a landmark or sign','Notice people, light or sound','Check where you could pause or leave'],feedback:['A landmark gives you one point of reference.','You noticed a feature that may matter to you today.','You identified an optional pause or exit point.']},
      SEAT:{prompt:'Try a position that fits this moment; you can change it at any time.',options:['Choose a place with an easy way out','Choose a place near the shared activity','Choose a place with less glare or passing traffic'],feedback:['You keep a clear route to step away and return.','You stay closer to the shared activity.','You choose a position with a different sensory trade-off.']},
      CARD:{prompt:'Select up to two preferences to keep visible, or leave them all unchecked.',options:['Written information','A pause or exit option','A person to ask'],feedback:['A written preference is available to refer to.','A pause remains an option, not a requirement.','You have identified a possible contact; you do not have to use it.']},
      MSG:{prompt:'Choose a draft message. This prototype does not send or save messages.',options:['“Could you send me the next step?”','“Please message me if the plan changes.”','“I will decide later; no reply needed.”'],feedback:['This draft asks for one practical detail.','This draft requests a written update.','This draft keeps your decision open.']}
    },
    zh:{
      ARR:{prompt:'把接下来有用的线索按你觉得合适的顺序摆放。',options:['先看下一步','先看人物或地点信息','把两条线索放在一起'],feedback:['下一步现在更容易找到。','你把想确认的细节放在前面。','你把信息放在一起，没有给它们排优先级。']},
      PLC:{prompt:'选择此刻想放在手边的东西，也可以什么都不带。',options:['把文字提示放在手边','把熟悉的物品放在手边','不额外拿东西'],feedback:['如果想再确认，文字提示就在手边。','物品只是一个选项，不必一定使用。','你让双手保持空着；之后仍可以改变主意。']},
      NODE:{prompt:'标记一个可能帮助你决定下一步的地点。',options:['标出直接路线','标出可以暂停的地方','标出可以询问或确认的地方'],feedback:['你标出了图示中的较短路线。','你加上了一个可能的暂停点。','你标出了一处信息点；这不是实时导航。']},
      READ:{prompt:'打开信息卡，再选一项想留在眼前的内容。',options:['保留房间或路线信息','保留时间或下一步','先关掉，之后再决定'],feedback:['这条信息会留在此刻的视野里。','下一步更容易回看。','你把信息留到之后处理；没有丢失任何内容。']},
      ASK:{prompt:'选一句简短的话来试试。回应是虚构示例，不代表工作人员或同学一定会这样回答。',options:['“可以告诉我下一步怎么做吗？”','“可以写下来或指给我看吗？”','“我现在先不需要，谢谢。”'],feedback:['对方给出了一项具体的下一步。','对方用文字或视觉线索回应。','对方接受你先暂停，并保留选择空间。']},
      LOOK:{prompt:'花一点时间看看周围。你想先确认什么？',options:['寻找地标或指示牌','留意人群、光线或声音','确认哪里可以暂停或离开'],feedback:['地标给了你一个参照点。','你留意到一项此刻可能重要的环境信息。','你找到一个可选的暂停点或出口。']},
      SEAT:{prompt:'试着选择一个适合此刻的位置；之后随时可以调整。',options:['选一个方便离开的位置','选一个靠近共同活动的位置','选一个少些眩光或人流的位置'],feedback:['你保留了离开后再回来的路线。','你更靠近共同活动。','你选了一个感官条件有所不同的位置。']},
      CARD:{prompt:'最多勾选两项想保留的偏好，也可以全部不选。',options:['文字信息','暂停或离开的选项','可以询问的人'],feedback:['你可以随时回看这项文字偏好。','暂停仍然只是一个选项，不是要求。','你标出一位可能联系的人，但不必真的联系。']},
      MSG:{prompt:'选择一条消息草稿。本原型不会发送或保存消息。',options:['“可以把下一步发给我吗？”','“如果安排有变，请发消息告诉我。”','“我晚些再决定，不用回复。”'],feedback:['这条草稿只询问一项实际信息。','这条草稿请求文字更新。','这条草稿让你的决定保持开放。']}
    }
  };
  const eventInteractionContext={
    schedule:{en:'the timetable before leaving home',zh:'出门前查看课表'},bag:{en:'packing for the campus day',zh:'为校园的一天收拾随身物品'},preview:{en:'choosing how to approach campus',zh:'选择如何前往校园'},station:{en:'checking a station announcement',zh:'确认车站广播的信息'},street:{en:'crossing where traffic and people overlap',zh:'经过车流和人群交错的路口'},park:{en:'passing the dog and its handler',zh:'经过遛狗的人和狗'},entry:{en:'entering a busy campus doorway',zh:'走进较忙的校园入口'},reception:{en:'asking reception for a room route',zh:'向前台询问教室路线'},room:{en:'finding an unfamiliar teaching room',zh:'寻找不熟悉的教室'},seat:{en:'settling into a classroom seat',zh:'在教室里选择座位'},group:{en:'starting a task with classmates',zh:'和同学开始小组任务'},change:{en:'responding to a room change',zh:'处理临时换教室'},cafe:{en:'deciding what to do about lunch',zh:'决定午餐时怎么安排'},pause:{en:'choosing what to do during a pause',zh:'决定暂停时做什么'},support:{en:'responding to a peer’s invitation',zh:'回应同学的活动邀请'}
  };
  const personaApproach={
    mei:{en:'Mei uses her visual-planning strength and keeps a clear next step.',zh:'Mei 运用视觉规划的优势，把下一步留得清楚。'},
    sam:{en:'Sam draws on a shared-interest mindset and keeps room to choose how much to join.',zh:'Sam 从共同兴趣出发，也为自己保留决定参与多少的空间。'},
    leila:{en:'Leila notices a detail in the setting and keeps control over when to pause.',zh:'Leila 留意环境细节，并由自己决定何时暂停。'}
  };
  const personaApproachByEvent={
    schedule:{mei:'organises the morning visually',sam:'checks what the shared task involves',leila:'looks ahead for possible changes'},
    bag:{mei:'chooses a useful item deliberately',sam:'balances a useful item against carrying weight',leila:'keeps an individual support option available'},
    preview:{mei:'compares route information',sam:'weighs the route against the day’s activities',leila:'looks for a way to pause en route'},
    station:{mei:'checks the announcement in a second format',sam:'chooses how to clarify the change',leila:'takes time before moving on'},
    street:{mei:'weighs the extra walking against the surroundings',sam:'keeps control over pace and direction',leila:'notices how the crossing is changing'},
    park:{mei:'chooses how to pass the dog',sam:'sets a comfortable distance',leila:'decides whether to pause or change route'},
    entry:{mei:'looks for the next visible step',sam:'chooses when to join the flow',leila:'checks the entrance before going in'},
    reception:{mei:'asks for information she can revisit',sam:'keeps the question specific',leila:'shares only the detail needed'},
    room:{mei:'connects the room number to a visual cue',sam:'looks for a direct way to orient himself',leila:'chooses between exploring and asking'},
    seat:{mei:'balances a clear exit with following the lesson',sam:'balances group access with a route to pause',leila:'checks light and movement around the seat'},
    group:{mei:'makes the next steps visible',sam:'starts from a game-making strength',leila:'takes time to understand the activity'},
    change:{mei:'checks the route and timing together',sam:'checks whether the group plan still fits',leila:'decides when and how to follow up'},
    cafe:{mei:'checks the space before choosing where to eat',sam:'balances company with the option to pause',leila:'notices where light and movement are different'},
    pause:{mei:'chooses whether information or rest is useful now',sam:'chooses between contact, quiet and planning',leila:'decides how much contact feels right'},
    support:{mei:'asks for a practical update without oversharing',sam:'gets enough detail to decide about joining',leila:'keeps the option to respond later'}
  };
  const flagLabels={
    'plan.written':{en:'a written plan',zh:'一份书面计划'},'plan.reviewed':{en:'checked class information',zh:'确认了课程信息'},'plan.flexible':{en:'kept the plan open',zh:'保留了灵活安排'},
    'bag.familiar':{en:'a familiar item is available',zh:'熟悉的物品在手边'},'bag.audio':{en:'an audio option is available',zh:'多了一种声音调节选择'},'bag.light':{en:'the bag is lighter',zh:'背包轻了一些'},
    'route.direct':{en:'a direct route preview',zh:'直接路线预览'},'route.pause':{en:'a possible pause point',zh:'一个可能的暂停点'},'route.text':{en:'written route steps',zh:'文字路线步骤'},
    'info.notice':{en:'the written notice',zh:'书面通知'},'info.person':{en:'a staff explanation',zh:'工作人员的说明'},'info.wait':{en:'time to check before moving',zh:'继续走之前的确认时间'},
    'street.detour':{en:'a side route',zh:'旁边的一条路线'},'street.timing':{en:'a calmer time to cross',zh:'人少一些时再过路口'},'street.direct':{en:'the direct crossing',zh:'直接通过路口'},
    'park.sidepath':{en:'distance from the dog',zh:'与狗保持一段距离'},'park.pause':{en:'a pause while the dog passes',zh:'等狗经过时暂停'},'park.main':{en:'the main path',zh:'继续走主路'},
    'entry.sign':{en:'the entrance sign',zh:'入口指示牌'},'entry.wait':{en:'a quieter moment to enter',zh:'人少些时再进入'},'entry.ask':{en:'a direct answer about where to go',zh:'关于方向的直接答复'},
    'recep.writtenRoute':{en:'written route steps',zh:'写下来的路线步骤'},'recep.landmark':{en:'a named landmark',zh:'一个明确的地标'},'recep.map':{en:'a self-directed map check',zh:'自己查看地图'},
    'room.guide':{en:'a floor guide',zh:'楼层指引'},'room.ambassador':{en:'an ambassador’s directions',zh:'学生大使的指引'},'room.explore':{en:'time to explore the corridor',zh:'熟悉走廊的时间'},
    'seat.exit':{en:'a seat with an easy exit',zh:'方便离开的座位'},'seat.light':{en:'a light adjustment request',zh:'调整光线的请求'},'seat.group':{en:'a seat near the group',zh:'靠近小组的座位'},
    'group.roles':{en:'written group roles',zh:'写下来的小组分工'},'group.firstTask':{en:'a first small task',zh:'一项小组起步任务'},'group.observe':{en:'time to observe first',zh:'先观察的时间'},
    'change.staff':{en:'a staff update',zh:'工作人员的更新'},'change.peer':{en:'a classmate’s message',zh:'同学发来的消息'},'change.defer':{en:'the option to decide later',zh:'稍后再决定的空间'},
    'cafe.stay':{en:'staying for lunch with a pause option',zh:'留在咖啡厅并保留暂停选择'},'cafe.quieter':{en:'a less busy lunch place',zh:'人少一些的午餐地点'},'cafe.return':{en:'returning at another time',zh:'改个时间再来'},
    'pause.rest':{en:'a short rest',zh:'短暂休息'},'pause.message':{en:'a message to someone trusted',zh:'给信任的人发消息'},'pause.plan':{en:'the next activity information',zh:'下一项活动的信息'},
    'support.asked':{en:'more information before deciding',zh:'决定前多了解一些'},'support.preference':{en:'one practical preference shared',zh:'分享了一项实际偏好'},'support.later':{en:'the option to answer later',zh:'之后再回应的空间'}
  };
  const eventContextNext={
    schedule:{en:'the bag-packing moment',zh:'收拾随身物品时'},bag:{en:'the route preview',zh:'预览路线时'},preview:{en:'the station notice',zh:'查看车站通知时'},station:{en:'the busy crossing',zh:'经过繁忙路口时'},street:{en:'the dog-walking path',zh:'经过遛狗路段时'},park:{en:'the campus entrance',zh:'到达校园入口时'},entry:{en:'the reception conversation',zh:'和前台交流时'},reception:{en:'finding the teaching room',zh:'寻找教室时'},room:{en:'choosing a classroom seat',zh:'选择课堂座位时'},seat:{en:'starting the group task',zh:'开始小组任务时'},group:{en:'responding to the room change',zh:'处理教室变更时'},change:{en:'choosing where to eat',zh:'决定午餐地点时'},cafe:{en:'choosing what to do during the pause',zh:'午餐后暂停时'},pause:{en:'responding to the afternoon invitation',zh:'回应下午活动邀请时'},support:{en:'the end-of-day reflection',zh:'回顾这一天时'}
  };
  function getChoiceCopy(event,index,language,personId){
    const zh=language==='zh',copy=zh?zhStory.events[event.id]:null,choices=copy?.choices;
    let c=event.choices[index],out={label:zh&&choices?choices[index][0]:c.label,detail:zh&&choices?choices[index][1]:c.detail,reply:zh&&choices?choices[index][2]:c.reply};
    const special=personaReplies[language]?.[personId]?.[event.id]?.[index];if(special)out.reply=special;
    if(event.id==='cafe'){const options=zh?[
      ['留在咖啡厅，需要时示意暂停','留在共享空间；如果需要，可以示意想暂停一下。','你留在共享空间，需要时可以选择示意暂停。是否寻求支持由你决定。'],
      ['换到人少一些的地方','改变地点，找一个此刻更合适的环境。','你换到人少一些的地方。找到新地点需要花些精力，空间信息会有帮助。'],
      ['改个时间再来','先离开，之后再决定是否回来。','你把用餐时间改到稍后。何时参与由你自己决定。']
    ]:[
      ['Stay for lunch and signal for a pause if needed','Remain in the shared space; you can signal for a pause if you want one.','You stay in the shared space and can signal for a pause if you want one. Whether to ask for support remains your choice.'],
      ['Find a less busy place','Change the setting to a place that feels more manageable now.','You move to a less busy place. Finding it takes some effort, so clear space information would help.'],
      ['Return at another time','Leave for now and decide later whether to come back.','You move lunch to another time. When to participate remains your choice.']
    ];out={label:options[index][0],detail:options[index][1],reply:options[index][2]}}
    return out;
  }
  function buildBranchSpecs(){
    const result={};
    const chronological=chapters.flatMap(ch=>ch.events.map(e=>({chapterId:ch.id,event:e})));
    const addResponder=(event,index,language)=>{
      const rows=responderResponses[language]?.[event.id];return rows?rows[index]:'';
    };
    characters.forEach(person=>{
      result[person.id]={};
      chronological.forEach(({event},eventIndex)=>{
        result[person.id][event.id]=event.choices.map((choice,index)=>{
          const types=interactionTypes[event.id],type=types[index],next=chronological[eventIndex+1]?.event;
          const flag=branchFlags[event.id][index],action=postActions[event.id][index];
          const locales={};
          ['en','zh'].forEach(language=>{
            const zh=language==='zh',copy=interactionCopy[language][type],localized=getChoiceCopy(event,index,language,person.id);
            const approach=personaApproach[person.id][language],specific=personaThoughts[event.id]?.[person.id]?.[zh?1:0]||'';
            const setup=zh?`${person.name} 在${eventInteractionContext[event.id].zh}时这样想：“${specific}”`: `${person.name}, while ${eventInteractionContext[event.id].en}, is thinking: “${specific}”`;
            const baseResult=localized.reply||localized.detail;
            const prompt=zh?`${setup} “${localized.label}”之后，${copy.prompt}`:`${setup} After “${localized.label}”, ${copy.prompt}`;
            const labels=copy.options.map((label,optionIndex)=>{
              if(type==='ASK'&&event.id==='reception')return zh?['“可以把路线写下来吗？”','“附近有什么地标？”','“我先自己看地图。”'][optionIndex]:['“Could you write the route down?”','“Is there a nearby landmark?”','“I will check the map myself.”'][optionIndex];
              if(type==='ASK'&&event.id==='support')return zh?['“活动大概是什么安排？”','“换教室时请发消息。”','“我晚些再决定。”'][optionIndex]:['“What is the activity like?”','“Please message me if the room changes.”','“I will decide later.”'][optionIndex];
              if(type==='MSG'&&event.id==='change')return zh?['“请告诉我新教室和路线。”','“我会和同学确认。”','“我晚点再看更新。”'][optionIndex]:['“Please send the new room and route.”','“I will check with a classmate.”','“I will look at the update later.”'][optionIndex];
              return label;
            });
            const options=labels.map((label,optionIndex)=>({id:`${event.id}-${index+1}-micro-${optionIndex+1}`,label,feedback:zh?`${copy.feedback[optionIndex]}${eventContextNext[event.id]?` ${person.name} 已把这项选择带到${eventContextNext[event.id].zh}。`:''}`:`${copy.feedback[optionIndex]}${eventContextNext[event.id]?` ${person.name} can carry this into ${eventContextNext[event.id].en}.`:''}`}));
            const exactReply=localized.reply;
            const resultText=zh?`${approach} ${person.name} 的个人想法：“${specific}” ${baseResult}`:`${approach} ${person.name}’s thought: “${specific}” ${baseResult}`;
            const setFlags=[flag];
            const downstream=next?{event:next.id,effect:'note',text:zh?`前一步：${person.name} 选择了“${flagLabels[flag].zh}”。在${eventContextNext[event.id].zh}时，可以继续采用、调整，或不沿用这项选择。`:`Earlier, ${person.name} chose ${flagLabels[flag].en}. At ${eventContextNext[event.id].en}, they can keep it, adjust it or leave it behind.`}:{event:'ending',effect:'note',text:zh?`结尾回顾会记录：${person.name} ${flagLabels[flag].zh}。`:`The day-end review will note that ${person.name} chose ${flagLabels[flag].en}.`};
            const responder=addResponder(event,index,language);
            locales[language]={
              action:{pre:event.id==='pause'?'look':(event.action||'look'),post:action,asset:'existing'},
              interaction:{type,steps:[{id:`${event.id}-${index+1}-main`,prompt,options,defaultOnSkip:{optionIndex:2,label:zh?'使用默认选择':'Use the default'}} ,{id:`${event.id}-${index+1}-confirm`,prompt:zh?'确认这项人物行动，或返回更改刚才的细节。':'Confirm the character action, or go back and change the detail.'}],defaultOnSkip:{optionIndex:2,feedback:copy.feedback[2]}},
              result:{text:resultText,selectedChoice:localized.label,detail:localized.detail,reply:exactReply},
              responder:{text:responder||''},setFlags,downstream:[downstream],
              ending:{note:zh?`${person.name} ${flagLabels[flag].zh}；这描述的是一次选择，不是得分或建议。`:`${person.name} chose ${flagLabels[flag].en}; this records one choice, not a score or recommendation.`}
            };
          });
          return locales;
        });
      });
    });
    return result;
  }
  const branchSpec=buildBranchSpecs();
  const chronologicalEvents=chapters.flatMap(ch=>ch.events.map(event=>({chapterId:ch.id,event})));
  const upstreamDependencies={room:'reception',change:'group',support:'pause'};
  function upstreamChoice(eventId){const source=upstreamDependencies[eventId];if(!source)return null;const match=chronologicalEvents.find(x=>x.event.id===source);return match?state.done[`${match.chapterId}:${source}`]?.choiceIndex??null:null}
  function isStaleRecord(eventId,record){return !!record&&Object.prototype.hasOwnProperty.call(upstreamDependencies,eventId)&&record.upstreamChoiceAtCommit!==upstreamChoice(eventId)}
  function deriveFlags(){
    const flags={};
    chronologicalEvents.forEach(({chapterId,event})=>{const record=state.done[`${chapterId}:${event.id}`];if(!record||isStaleRecord(event.id,record))return;const spec=branchSpec[state.character]?.[event.id]?.[record.choiceIndex]?.[state.language];if(spec)spec.setFlags.forEach(flag=>flags[flag]=true)});
    return flags;
  }

  function applyArt(scene){
    const cfg=ART.scenes[scene];if(!cfg)return;
    chapters.forEach(ch=>{if(ch.scene!==scene)return;if(cfg.start)ch.start={...cfg.start};ch.events.forEach(e=>{const h=cfg.hotspots&&cfg.hotspots[e.id];if(h){e.x=h.x;e.y=h.y}})});
    if(cfg.bounds)ART.bounds[scene]=cfg.bounds;
  }
  function buildSurfaceLayers(){
    ART.surfaceLayers={};
    Object.entries(ART.scenes).forEach(([scene,cfg])=>{
      ART.surfaceLayers[scene]=[];
      (cfg.surfaces||[]).forEach(surface=>{
        const img=ART.materialImages[surface.material];
        const x=Math.round(Number(surface.x)*TILE),y=Math.round(Number(surface.y)*TILE);
        const width=Math.round(Number(surface.w)*TILE),height=Math.round(Number(surface.h)*TILE);
        const tileSize=Math.round(Number(surface.tile||1)*TILE);
        if(!img||!Number.isFinite(x)||!Number.isFinite(y)||width<=0||height<=0||tileSize<=0)return;
        const layer=document.createElement('canvas');layer.width=width;layer.height=height;
        const layerCtx=layer.getContext('2d');layerCtx.imageSmoothingEnabled=false;
        for(let py=0;py<height;py+=tileSize){for(let px=0;px<width;px+=tileSize){layerCtx.drawImage(img,0,0,img.width,img.height,px,py,Math.min(tileSize,width-px),Math.min(tileSize,height-py))}}
        ART.surfaceLayers[scene].push({canvas:layer,x,y,opacity:Number.isFinite(Number(surface.opacity))?Math.max(0,Math.min(1,Number(surface.opacity))):1});
      });
    });
  }
  function drawMaterialSurfaces(scene){
    if(!MATERIAL_SURFACES_ENABLED)return;
    (ART.surfaceLayers[scene]||[]).forEach(layer=>{ctx.save();ctx.globalAlpha=layer.opacity;ctx.imageSmoothingEnabled=false;ctx.drawImage(layer.canvas,layer.x,layer.y);ctx.restore()});
  }
  function toggleCustomize(){const all=Object.keys(ART.sprites).length>0&&Object.values(ART.sprites).every(s=>s.ok);const el=document.querySelector('.customize-panel');if(el)el.classList.toggle('hidden',all)}
  function prepareReactionSprite(img){
    const source=document.createElement('canvas');source.width=img.width;source.height=img.height;
    const sourceCtx=source.getContext('2d',{willReadFrequently:true});sourceCtx.drawImage(img,0,0);
    const pixels=sourceCtx.getImageData(0,0,source.width,source.height),data=pixels.data,cutoff=112;
    let x0=source.width,y0=source.height,x1=-1,y1=-1;
    for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){
      const a=(y*source.width+x)*4+3;
      if(data[a]<cutoff){data[a]=0;continue}
      data[a]=255;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
    }
    if(x1<0)return null;
    sourceCtx.putImageData(pixels,0,0);
    x0=Math.max(0,x0-2);y0=Math.max(0,y0-2);x1=Math.min(source.width-1,x1+2);y1=Math.min(source.height-1,y1+2);
    const clean=document.createElement('canvas');clean.width=x1-x0+1;clean.height=y1-y0+1;
    clean.getContext('2d').drawImage(source,x0,y0,clean.width,clean.height,0,0,clean.width,clean.height);
    return clean;
  }
  function stripFrameBounds(img,count){
    const scan=document.createElement('canvas');scan.width=img.width;scan.height=img.height;const g=scan.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);const data=g.getImageData(0,0,img.width,img.height).data,cellW=img.width/count,frames=[];
    for(let n=0;n<count;n++){let x0=Math.ceil(n*cellW),x1=Math.floor((n+1)*cellW)-1,y0=img.height,y1=-1;for(let y=0;y<img.height;y++)for(let x=Math.ceil(n*cellW);x<Math.floor((n+1)*cellW);x++)if(data[(y*img.width+x)*4+3]>24){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}frames.push(x1>=x0&&y1>=y0?{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1}:{x:Math.ceil(n*cellW),y:0,w:Math.floor(cellW),h:img.height})}return frames;
  }
  function drawAmbientFrame(img,bounds,index,count,cx,footY,maxW,maxH,flip=false,alpha=1){
    if(!img)return;const b=bounds?.[index%count]||{x:Math.floor(index%count*img.width/count),y:0,w:img.width/count,h:img.height},scale=Math.min(maxW/b.w,maxH/b.h),w=b.w*scale,h=b.h*scale;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.translate(Math.round(cx),Math.round(footY));if(flip)ctx.scale(-1,1);ctx.drawImage(img,b.x,b.y,b.w,b.h,-w/2,-h,w,h);ctx.restore();ctx.imageSmoothingEnabled=false;
  }
  function loadArt(){
    Object.entries(ART.scenes).forEach(([scene,cfg])=>{const img=new Image();img.onload=()=>{ART.imgs[scene]=img;applyArt(scene);if(state.screen==='gameScreen'){if(chapter().scene===scene)state.player={...chapter().start};renderChapter()}};img.onerror=()=>console.warn(`Scene image unavailable: ${cfg.src}`);img.src=cfg.src});
    const stripCounts={vehicleSheet:3,pedestrianWalkSheet:4,dogWalkCycle:4};
    Object.entries(CFG.ambient||{}).forEach(([key,src])=>{const img=new Image();img.onload=()=>{ART.ambientImages[key]=img;if(stripCounts[key])ART.ambientFrameBounds[key]=stripFrameBounds(img,stripCounts[key]);if(state.screen==='gameScreen'&&chapter().scene==='route')drawWorld()};img.onerror=()=>console.warn(`Ambient sprite unavailable: ${src}`);img.src=src});
    Object.values(ART.sprites).forEach(cfg=>{
      const load=(src,key,required=false)=>{if(!src)return;const img=new Image();img.onload=()=>{cfg[key]=img;cfg.ok=key==='img'||cfg.ok;if(key==='img'){toggleCustomize();if(state.screen==='characterScreen')renderCharacters();else if(state.screen==='gameScreen')renderChapter()}};img.onerror=()=>{if(required)console.warn(`Character sprite unavailable: ${src}`)};img.src=src};
      load(cfg.src,'img',true);load(cfg.walkSrc,'walkImg');load(cfg.actionSrc,'actionImg');
      Object.entries(cfg.reactions||{}).forEach(([name,reaction])=>{const img=new Image();img.onload=()=>{cfg.reactionImages=cfg.reactionImages||{};cfg.reactionImages[name]=prepareReactionSprite(img);if(state.screen==='gameScreen')drawWorld();drawReactionPreviews(document)};img.onerror=()=>console.warn(`Reaction sprite unavailable: ${reaction.src}`);img.src=reaction.src});
    });
    if(MATERIAL_SURFACES_ENABLED){const materials=Object.entries(CFG.materials||{});let pending=materials.length;const finish=()=>{pending--;if(pending===0){buildSurfaceLayers();if(state.screen==='gameScreen')renderChapter()}};if(!pending)buildSurfaceLayers();materials.forEach(([key,src])=>{const img=new Image();img.onload=()=>{ART.materialImages[key]=img;finish()};img.onerror=()=>{console.warn(`Material texture unavailable: ${src}`);finish()};img.src=src})}
  }
  document.addEventListener('keydown',ev=>{if(ev.shiftKey&&ev.key==='G'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))ART.debug=!ART.debug});

  const BASE_METERS={energy:70,focus:70,load:15};
  let activeLanguage='en';
  const state = {screen:'welcomeScreen',language:'en',character:null,hair:'dark',outfit:'coral',chapter:0,player:{x:14,y:13},meters:{...BASE_METERS},ambientLoad:0,done:{},journal:[],event:null,mode:'choice',pendingChoice:null,actionLog:[],interactionLog:[],cardText:'',privateReflection:'',localPosts:[],settings:{largeText:false,hideMeters:false,lowDetail:false,reduceMotion:false,ambientSound:false},keys:new Set(),touchKeys:new Set(),lastFrame:0,carrying:false,waveUntil:0,resting:false,homeIntro:'sleeping',actionUntil:0,actionName:'',characterReaction:null,eventTrigger:null,infoTrigger:null,paused:false,proximityCue:null,proximitySeen:new Set(),autoLookUntil:0};
  const routeAmbient={dogBarkAt:0,dogBarkTriggered:false,constructionTriggered:false};
  let routeActors=[];
  let ambientAudio=null,ambientNoiseGain=null,ambientAudioTarget=-1;
  const hairColors={dark:'#272d32',brown:'#805337',auburn:'#a64f37'};
  const outfitColors={coral:'#d87857',blue:'#5277a8',sage:'#7b9869'};
  const chapter = () => chapters[state.chapter];
  const selectedCharacter = () => characters.find(c => c.id === state.character);
  const eventKey = (event) => `${chapter().id}:${event.id}`;
  const completedCount = () => chapter().events.filter(e => state.done[eventKey(e)]&&!isStaleRecord(e.id,state.done[eventKey(e)])).length;

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    $(id).classList.remove('hidden');
    $('languageSwitch').classList.toggle('hidden',id!=='welcomeScreen');
    document.body.classList.toggle('is-playing',id==='gameScreen');
    $('app').inert=false;
    $('eventOverlay').classList.add('hidden');$('eventOverlay').setAttribute('aria-hidden','true');
    state.proximityCue=null;renderProximityCue();
    $('infoOverlay').classList.add('hidden');$('infoOverlay').setAttribute('aria-hidden','true');
    $('gameMenuPanel').classList.add('hidden');$('gameMenuButton').setAttribute('aria-expanded','false');
    state.screen=id;
    if(id!=='gameScreen')window.scrollTo({top:0,behavior:'instant'});
  }

  const welcomeCopy = {
    en: {
      brand:'Same Day, Three Paths', brandTag:'TEAM 6 · UCL EAST CONCEPT', settings:'Settings', about:'About',
      footerTeam:'TEAM 6 · DESIGN INNOVATION 2026', footerNote:'Prototype content needs lived-experience review before research or public deployment.',
      eyebrow:'AN INTERACTIVE CAMPUS DAY · PLAYABLE CONCEPT', headline:'One day.', subheadline:'Different paths.',
      description:"Starting university means learning new routes, spaces and expectations. Explore a day at an illustrative UCL East campus through one student's choices.",
      pills:['5 chapters','3 perspectives','No right way to cope'], start:'Start a new day',
      fine:"This is a student design prototype. Characters and campus conditions are fictionalised research hypotheses, not a diagnostic or live navigation tool.",
      art:'Pixel art storyboard showing a student preparing for their day and approaching campus', caption:'FROM HOME → STRATFORD → UCL EAST'
    },
    zh: {
      brand:'同一天，三种路径', brandTag:'TEAM 6 · UCL EAST 概念原型', settings:'设置', about:'关于',
      footerTeam:'TEAM 6 · 设计创新 2026', footerNote:'原型在用于研究或公开发布前，需与有相关生活经验的人共同审阅。',
      eyebrow:'互动式校园体验 · 可试玩原型', headline:'同一天。', subheadline:'不同的路径。',
      description:'刚进入大学时，路线、空间和各种规则都需要慢慢熟悉。通过一位学生的一天，看看不同选择如何影响校园体验。',
      pills:['5 个章节','3 种视角','没有唯一的应对方式'], start:'开始新的一天',
      fine:'这是课程设计原型。人物与校园情境均为研究假设，不构成诊断，也不能作为实时导航。主页和游戏内容均可切换中英文。',
      art:'像素风故事板：学生在家准备并前往校园', caption:'从家中 → Stratford → UCL East'
    }
  };
  function setWelcomeLanguage(language){
    const t=welcomeCopy[language]||welcomeCopy.en;
    activeLanguage=language==='zh'?'zh':'en';state.language=activeLanguage;
    document.documentElement.lang=language==='zh'?'zh-CN':'en';
    $('brandTitle').textContent=t.brand;$('brandTag').textContent=t.brandTag;$('settingsButton').textContent=t.settings;$('aboutButton').textContent=t.about;
    $('footerTeam').textContent=t.footerTeam;$('footerNote').textContent=t.footerNote;
    $('languageSwitch').setAttribute('aria-label',language==='zh'?'主页语言':'Homepage language');
    $('welcomeEyebrow').textContent=t.eyebrow;$('welcomeHeadline').textContent=t.headline;$('welcomeSubheadline').textContent=t.subheadline;
    $('welcomeDescription').textContent=t.description;$('welcomePillOne').textContent=t.pills[0];$('welcomePillTwo').textContent=t.pills[1];$('welcomePillThree').textContent=t.pills[2];
    $('startButton').innerHTML=`${t.start} <span aria-hidden="true">→</span>`;$('welcomeFinePrint').textContent=t.fine;
    $('welcomeArt').setAttribute('aria-label',t.art);$('welcomeArtCaption').textContent=t.caption;
    $('languageEnglish').classList.toggle('selected',language==='en');$('languageEnglish').setAttribute('aria-pressed',String(language==='en'));
    $('languageChinese').classList.toggle('selected',language==='zh');$('languageChinese').setAttribute('aria-pressed',String(language==='zh'));
    $('welcomeScreen').setAttribute('lang',language==='zh'?'zh-CN':'en');
    localizeStatic();
    if(state.screen==='characterScreen')renderCharacters();
    if(state.screen==='gameScreen')renderChapter();
    if(state.screen==='endingScreen')showEnding();
    if(state.screen==='reflectionScreen'){localizeStatic();renderBodyStateGallery()}
    if(state.screen==='communityScreen')renderPosts();
  }

  const characterZh={
    mei:{age:'22 岁 · 新入学研究生',summary:'擅长用视觉方式思考；当需要同时熟悉多个新系统时，清楚的计划会有帮助。',strengths:['视觉思考','整理计划'],preferences:['书面步骤','提前看路线'],friction:'不熟悉的系统与重复解释',focus:'Mei 可能需要花精力寻找可靠信息，并决定先做什么。'},
    sam:{age:'19 岁 · 本科一年级',summary:'喜欢创作游戏，也希望通过共同兴趣与别人建立联系。',strengths:['游戏设计','共同兴趣'],preferences:['明确活动安排','方便离开的方式'],friction:'未说明的社交规则、繁忙空间和小组分工',focus:'Sam 可能既想参与，也希望社交期待说得更清楚。'},
    leila:{age:'20 岁 · 暂定故事人物',summary:'喜欢观察和摄影，也希望自己选择在哪里暂停。',strengths:['留意细节','摄影'],preferences:['光线信息','可选择的休息地点'],friction:'眩光与突然变化的环境',focus:'Leila 是暂定设计人物，仍需与自闭症学生共同审阅。'}
  };
  function localizeStatic(){
    const zh=state.language==='zh';
    const set=(selector,value,root=document)=>{const el=root.querySelector(selector);if(el)el.textContent=value};
    const chars=$('characterScreen');
    set('.screen-heading .eyebrow',zh?'开始新的一天前':'BEFORE THE DAY BEGINS',chars);
    set('#characterTitle',zh?'选择一个视角':'Choose a perspective',chars);
    set('.screen-heading > p:last-child',zh?'每个人都有自己的兴趣、优势和偏好。以下是人物草稿，不是类型或难度等级。':'Each character has interests, strengths and preferences. They are individual story drafts, not types or difficulty levels.',chars);
    set('.customize-panel h2',zh?'自定义人物外观':'Make the character yours',chars);
    set('.customize-panel p',zh?'外观选项只改变人物外观。':'Cosmetic choices change appearance only.',chars);
    chars.querySelectorAll('.customize-panel label').forEach((el,i)=>{const label=el.firstChild;if(label)label.textContent=zh?(i===0?'发型':'服装'):(i===0?'Hair ':'Outfit ')});
    $('beginGame').textContent=zh?'开始这一天 →':'Begin this day →';$('backToWelcome').textContent=zh?'← 返回':'← Back';
    const ending=$('endingScreen');set('.eyebrow',zh?'校园生活的一天结束':'END OF THE CAMPUS DAY',ending);set('h1',zh?'按自己的节奏回到家。':'Home, at your own pace.',ending);
    const ep=ending.querySelector('.ending-copy > p:not(.eyebrow)');if(ep)ep.textContent=zh?'你依据当时掌握的信息和支持做出了选择。换一个人或换一天，也可能走出不同的路径。':'You made choices based on the information and support available. A different person or a different day could lead to a different path.';
    const ef=ending.querySelector('.ending-copy > .fine-print');if(ef)ef.textContent=zh?'故事在这里结束。现实中的疲惫和支持需要不会按日程重置。':'The story’s day ends here. Real fatigue and support needs do not reset on a schedule.';
    $('reflectionButton').textContent=zh?'回顾这一天 →':'Reflect on the day →';$('replayButton').textContent=zh?'再走一条路径':'Play another path';
    const reflection=$('reflectionScreen');set('.eyebrow',zh?'体验之后':'AFTER THE EXPERIENCE',reflection);set('h1',zh?'游戏之外还可以做什么？':'What happens beyond the game?',reflection);set('.screen-heading > p:last-child',zh?'用这个故事讨论信息、交流和校园支持可以怎样改进。你的选择不会被发布。':'Use the story to discuss concrete changes in information, conversations and campus support. Your choices are not posted anywhere.',reflection);
    const cards=reflection.querySelectorAll('.reflection-grid article');
    const reflectionCopy=zh?[
      ['先问，再倾听','“在这种情况下，什么会有帮助？”比猜测每个人需要相同支持更有用。'],['让选择清楚可见','明确的教室信息、书面说明、暂停方式和离开规则，能让每个人自行选择。'],['一起改变环境','不该由学生独自承担所有负担。同伴、教职员和校园服务都能改变事情的运作方式。']
    ]:[['Ask, then listen','“What would help in this situation?” is more useful than assuming the same support works for everyone.'],['Make options visible','Clear room information, written instructions, pause options and exit rules let people make their own choices.'],['Change the setting','Students should not carry every burden alone. Peers, staff and campus services can change how situations work.']];
    cards.forEach((card,i)=>{set('h2',reflectionCopy[i][0],card);set('p',reflectionCopy[i][1],card)});
    set('label',zh?'私人回顾（可选）':'Private reflection (optional)',reflection);$('privateReflection').placeholder=zh?'我可以采取的一项行动，或这个故事遗漏的一件事……':'One action I could take, or one thing this story missed…';set('.reflection-prompt small',zh?'文字只留在本页，刷新或关闭后会清除。':'This text stays on this page and disappears when you refresh or close it.',reflection);
    $('communityButton').textContent=zh?'看看讨论空间的构想 →':'Explore the discussion space →';$('finishButton').textContent=zh?'到这里结束':'Finish here';
    const community=$('communityScreen');set('.eyebrow',zh?'可选的社群构想':'OPTIONAL COMMUNITY CONCEPT',community);set('h1',zh?'让讨论继续':'Keep the conversation open',community);set('.screen-heading > p:last-child',zh?'这是一个本地展示用的社群空间构想。内容不会发送到服务器，也不会与其他访客分享。':'This is a local demonstration of a possible community space. No posts are sent to a server or shared with other visitors.',community);
    set('.community-layout > div > h2',zh?'讨论主题':'Discussion themes',community);set('.community-compose h2',zh?'添加本地想法':'Add a local reflection',community);set('label[for="postTopic"]',zh?'主题':'Topic',community);set('label[for="postBody"]',zh?'你的想法':'Your thought',community);
    $('postBody').placeholder=zh?'分享建议或提出问题。此演示中请避免填写个人信息。':'Share a suggestion or a question. Please avoid personal details in this demo.';$('addPostButton').textContent=zh?'添加到本地预览':'Add to this local preview';
    const cFine=community.querySelector('.community-compose .fine-print');if(cFine)cFine.textContent=zh?'真实社群需要共同制定规则、内容管理、隐私控制和明确的校园反馈渠道。':'A real community would need co-designed rules, moderation, privacy controls and a clear route for campus feedback.';
    $('restartButton').textContent=zh?'再探索一条路径 →':'Explore another path →';$('backToReflection').textContent=zh?'← 返回回顾':'← Back to reflection';
  }

  function drawAvatar(el, char) {
    const c=document.createElement('canvas'); c.width=64;c.height=64;c.style.width='64px';c.style.height='64px';c.style.imageRendering='pixelated';
    const q=c.getContext('2d');q.imageSmoothingEnabled=false;
    q.fillStyle='#e6ecdc';q.fillRect(0,0,64,64);
    const chosen=state.character===char.id;
    if(!drawSpriteFrame(q,char.id,32,62,'down',0,58))drawPerson(q,32,34,2,chosen?outfitColors[state.outfit]:char.accent,true,chosen?state.hair:({mei:'dark',sam:'auburn',leila:'brown'}[char.id]));
    el.replaceChildren(c);
  }

  function renderCharacters() {
    const zh=state.language==='zh';
    $('characterCards').innerHTML=characters.map(c=>{const z=zh?characterZh[c.id]:c;return `<button type="button" class="character-card ${state.character===c.id?'selected':''}" data-character="${c.id}" aria-pressed="${state.character===c.id}"><span class="select-mark">${state.character===c.id?(zh?'已选择':'SELECTED'):(zh?'选择':'CHOOSE')}</span><div class="character-portrait" data-avatar="${c.id}"></div><h2>${c.name}</h2><span class="subline">${z.age}</span><p>${z.summary}</p><div class="tag-list">${[...z.strengths,...z.preferences].map(t=>`<span>${t}</span>`).join('')}</div>${c.provisional?`<span class="provisional">${zh?'暂定人物 · 需要审阅':'PROVISIONAL · NEEDS REVIEW'}</span>`:''}</button>`}).join('');
    document.querySelectorAll('[data-avatar]').forEach(el=>drawAvatar(el,characters.find(c=>c.id===el.dataset.avatar)));
    document.querySelectorAll('[data-character]').forEach(el=>el.addEventListener('click',()=>{state.character=el.dataset.character;renderCharacters();$('beginGame').disabled=false;}));
  }

  function startGame() {
    if(!state.character)return;
    state.chapter=0;state.done={};state.journal=[];state.pendingChoice=null;state.actionLog=[];state.interactionLog=[];state.cardText='';state.privateReflection='';state.localPosts=[];state.meters={...BASE_METERS};state.ambientLoad=0;state.player={...chapter().start};state.homeIntro='sleeping';state.carrying=false;state.resting=false;state.actionUntil=0;state.actionName='';state.characterReaction=null;state.paused=false;state.proximityCue=null;state.proximitySeen=new Set();state.autoLookUntil=0;clearHeldDirections();$('app').inert=false;
    routeAmbient.dogBarkAt=0;routeAmbient.dogBarkTriggered=false;routeAmbient.constructionTriggered=false;routeAmbient.dogX=null;routeAmbient.dogY=null;showScreen('gameScreen');renderChapter();
  }

  function renderChapter() {
    const c=localizedChapter(),p=selectedCharacter(),zh=state.language==='zh';
    $('chapterKicker').textContent=c.time;$('chapterTitle').textContent=c.title;$('chapterDescription').textContent=c.description;
    $('chapterProgress').innerHTML=chapters.map((_,i)=>`<span class="${i<state.chapter?'done':i===state.chapter?'active':''}" title="Chapter ${i+1}"></span>`).join('');
    $('profileName').textContent=p.name;$('profileLine').textContent=zh?characterZh[p.id].age:p.age;$('currentCharacterFooter').textContent=zh?`当前视角：${p.name} · ${p.provisional?'暂定人物':'人物草稿'}`:`Playing as ${p.name} · ${p.provisional?'provisional character':'proto-persona'}`;
    drawAvatar($('miniAvatar'),p);renderMeters();renderTasks();updateHomeControls();renderProximityCue();drawWorld();
  }

  function renderMeters() {
    const zh=state.language==='zh';
    const rows=[
      {key:'energy',id:'hudEnergy',label:zh?'体力':'Energy',icon:'✦',states:zh?['还撑得住','有点累','需要休息']:['Steady','Getting tired','Could use a rest'],detail:zh?'故事中的体力提示，反映当前情节里的活动负担。':'A story cue about the physical effort in this scene.'},
      {key:'focus',id:'hudFocus',label:zh?'专注':'Focus',icon:'◈',states:zh?['思路清楚','需要缓一缓','有点难集中']:['Clear','Taking a moment','Hard to focus'],detail:zh?'故事中的专注提示，不代表能力或诊断。':'A story cue about attention in this moment, not ability or diagnosis.'},
      {key:'load',id:'hudLoad',label:zh?'感官环境':'Sensory setting',icon:'〰',states:zh?['比较平静','有些热闹','刺激较多']:['Calm','Getting busy','A lot happening'],detail:zh?'这是当前场景的叙事提示，不是对自闭症或健康状况的测量。':'A narrative cue for this scene, not a measure of autism or health.'}
    ];
    const stateFor=key=>{const v=key==='load'?clamp(state.meters[key]+state.ambientLoad):state.meters[key];return key==='load'?(v<35?0:v<68?1:2):(v>=68?0:v>=38?1:2)};
    rows.forEach(row=>{const el=$(row.id);if(el){el.querySelector('.hud-label').textContent=row.label;el.querySelector('.hud-state').textContent=row.states[stateFor(row.key)];el.setAttribute('aria-label',`${row.label}: ${row.states[stateFor(row.key)]}. Open story status details.`)}});
    const details=rows.map(row=>`<article class="meter-detail"><span aria-hidden="true">${row.icon}</span><div><strong>${row.label} · ${row.states[stateFor(row.key)]}</strong><p>${row.detail}</p></div></article>`).join('')+`<p class="meter-note">${zh?'这些状态是故事提示，不是诊断或测量。每个人、每一天的感受都可能不同。':'These states are story cues, not diagnosis or measurement. A person or day can feel different.'}</p>`;
    if($('meterPanel'))$('meterPanel').innerHTML=details;
    $('meterHud').classList.toggle('hidden',state.settings.hideMeters);
  }

  function renderTasks() {
    const c=localizedChapter(), n=completedCount(),zh=state.language==='zh';
    $('taskCount').textContent=zh?`已查看 ${n}/${c.events.length}`:`${n}/${c.events.length} explored`;
    $('hudTaskCount').textContent=`${n}/${c.events.length}`;
    $('taskList').innerHTML=c.events.map(e=>{const record=state.done[eventKey(e)],stale=record&&isStaleRecord(e.id,record),done=record&&!stale;return `<button type="button" class="task-item ${done?'done':''} ${stale?'needs-reconfirm':''}" data-event="${e.id}"><span class="task-icon">${done?'✓':stale?'↻':e.icon}</span><span><strong>${e.title}</strong><small>${stale?(zh?'前序选择已变化 · 需要重新确认': 'Earlier choice changed · reconfirm this moment'):done?(zh?'已体验 · 可再次选择':'Played · revisit or choose again'):e.hint}</small></span></button>`}).join('');
    document.querySelectorAll('[data-event]').forEach(el=>{el.disabled=state.chapter===0&&state.homeIntro!=='ready';el.addEventListener('click',()=>startEventAction(c.events.find(e=>e.id===el.dataset.event),el))});
    $('nextChapterButton').disabled=n<c.required||(state.chapter===0&&state.homeIntro!=='ready');
    $('nextChapterButton').textContent=state.chapter===0?(zh?'出门 →':'Leave home →'):state.chapter===chapters.length-1?(zh?'结束这一天 →':'End the day →'):(zh?'继续这一天 →':'Continue the day →');
    $('doorButton').classList.toggle('hidden',n<c.required||state.homeIntro==='sleeping'||state.homeIntro==='waking');
    $('doorButton').disabled=n<c.required||(state.chapter===0&&state.homeIntro!=='ready');
    $('taskDrawer').querySelector('.task-tip').textContent=zh?'靠近时会自动出现情境提示。你可以选择查看回应，也可以继续探索；这里也能随时打开任一时刻。':'A scene cue appears as you approach. Choose to explore responses or keep moving; you can also open any moment here.';
    $('preferenceCardButton').textContent=zh?'我的偏好卡':'My preference card';
    $('nextHint').textContent=n<c.required?(zh?`再查看 ${c.required-n} 个时刻即可继续；之后仍可随时重看。`:`Explore ${c.required-n} more moment${c.required-n>1?'s':''} to continue. All moments remain available.`):(zh?'可以从房门继续，也可以探索其他时刻。':'You can continue now, or explore another moment.');
  }

  const PROXIMITY_RADIUS=4.1,PROXIMITY_RELEASE=5.8;
  function renderProximityCue(){
    const cue=state.proximityCue,root=$('proximityCue');if(!root)return;
    if(!cue){root.classList.add('hidden');return}
    const zh=state.language==='zh',person=selectedCharacter(),shown=currentEventCopy(cue.event),language=zh?'zh':'en';
    const thought=cue.thought||personaThoughts[cue.event.id]?.[person.id]?.[zh?1:0]||'';
    const description=cue.description||momentCueCopy[cue.event.id]?.[language]||shown.hint;
    $('proximityCueEyebrow').textContent=zh?'附近的情境线索':'A MOMENT NEARBY';
    $('proximityCueTitle').textContent=shown.title;
    $('proximityCueDescription').textContent=description;
    $('proximityCueThoughtName').textContent=`${person.name} · ${zh?'人物想法草稿':'draft character thought'}`;
    $('proximityCueThought').textContent=thought;
    $('proximityCueNote').textContent=zh?`人物想法是设计草稿，并非访谈原话。你可以忽略提示，继续走动。${person.provisional?' Leila 仍是待验证的人物草稿。':''}`:`Character thoughts are draft design copy, not interview quotes. You can ignore this cue and keep moving.${person.provisional?' Leila remains a provisional character awaiting review.':''}`;
    root.setAttribute('aria-label',zh?`附近的情境：${shown.title}`:`A moment nearby: ${shown.title}`);
    $('proximityRespondButton').textContent=zh?'看看可选回应':'Explore response options';
    $('proximityDismissButton').textContent=zh?'继续探索':'Keep exploring';
    drawAvatar($('proximityAvatar'),person);root.classList.remove('hidden');
  }
  function revealProximityCue(event,options={}){
    if(!event||state.screen!=='gameScreen'||state.paused)return false;
    const key=eventKey(event),same=state.proximityCue?.key===key;
    if(state.done[key]&&!isStaleRecord(event.id,state.done[key]))return false;
    if(state.proximitySeen.has(key)&&!same&&!options.force)return false;
    state.proximitySeen.add(key);
    const target=options.anchor||{x:event.x,y:event.y};
    state.proximityCue={event,key,source:options.source||'moment',createdAt:performance.now(),anchor:{x:target.x,y:target.y},description:options.description?.[state.language]||'',thought:options.thought?.[state.language]||options.thought||''};
    if(!state.settings.reduceMotion&&!REDUCED){
      state.autoLookUntil=performance.now()+750;
      const dx=target.x-state.player.x,dy=target.y-state.player.y;
      if(Math.abs(dx)>Math.abs(dy))state.facing=dx<0?'left':'right';else if(dy)state.facing=dy<0?'up':'down';
    }
    renderProximityCue();return true;
  }
  function updateProximityCue(){
    if(state.screen!=='gameScreen'||state.homeIntro!=='ready'||state.paused||state.event||!$('infoOverlay').classList.contains('hidden'))return;
    const drawerOpen=!$('taskDrawer').classList.contains('hidden'),menuOpen=!$('gameMenuPanel').classList.contains('hidden');
    if(drawerOpen||menuOpen)return;
    const active=state.proximityCue;
    if(active&&distance(active.anchor,state.player)>PROXIMITY_RELEASE){
      if($('proximityCue').contains(document.activeElement))return;
      state.proximityCue=null;renderProximityCue();
    }
    if(state.proximityCue)return;
    const next=chapter().events
      .filter(event=>!state.done[eventKey(event)]&&!state.proximitySeen.has(eventKey(event)))
      .map(event=>({event,d:distance(event,state.player)}))
      .filter(item=>item.d<=PROXIMITY_RADIUS)
      .sort((a,b)=>a.d-b.d)[0];
    if(next)revealProximityCue(next.event);
  }
  function dismissProximityCue(){
    if(!state.proximityCue)return;
    state.proximityCue=null;renderProximityCue();canvas.focus({preventScroll:true});
  }

  function reactionForChoice(characterId,eventId,choiceIndex){return reactionTriggers[characterId]?.[eventId]?.[choiceIndex]||null}
  function reactionCardMarkup(reactionId,person){
    const copy=reactionCopy[reactionId];if(!copy)return '';
    const zh=state.language==='zh',title=copy.title[zh?'zh':'en'],body=copy.body[zh?'zh':'en'];
    const note=zh?'虚构的个体反应，不是诊断，也不代表所有自闭症人士。':'A fictional individual response, not a diagnosis or a universal autistic experience.';
    const provisional=person.provisional?(zh?'Leila 是待验证的人物草稿。':'Leila is a provisional character awaiting review.'):'';
    return `<section class="reaction-card"><canvas data-reaction-preview="${person.id}:${reactionId}" width="132" height="168" role="img" aria-label="${escapeHTML(`${person.name}: ${title}`)}"></canvas><div><strong>${escapeHTML(zh?'此刻的身体反应':'A body response in this moment')} · ${escapeHTML(title)}</strong><p>${escapeHTML(body)}</p><small>${escapeHTML(`${note}${provisional?` ${provisional}`:''}`)}</small></div></section>`;
  }
  function drawReactionPreviews(root=document){
    root.querySelectorAll('canvas[data-reaction-preview]').forEach(view=>{
      const [characterId,reactionId]=view.dataset.reactionPreview.split(':'),img=ART.sprites[characterId]?.reactionImages?.[reactionId];if(!img)return;
      const g=view.getContext('2d');g.clearRect(0,0,view.width,view.height);g.imageSmoothingEnabled=false;
      const scale=Math.min(view.width/img.width,view.height/img.height),w=Math.round(img.width*scale),h=Math.round(img.height*scale);
      g.drawImage(img,Math.round((view.width-w)/2),Math.round((view.height-h)/2),w,h);
    });
  }
  function renderBodyStateGallery(){
    const zh=state.language==='zh',root=$('bodyStateGallery');if(!root)return;
    $('bodyStateExamplesTitle').textContent=zh?'更多身体状态示例':'More body-state examples';
    $('bodyStateExamplesIntro').textContent=zh?'这里展示的是不同人物的虚构个体情境，不是自闭症症状清单。感官体验、个人情绪与独立健康事件会分开展示。':'These fictional moments are not a checklist of autism symptoms. Sensory experiences, individual emotions and separate health events are shown in distinct groups.';
    const groups=zh?[
      {title:'感官体验与个人应对',note:'这些是虚构的个体体验和选择，不代表所有自闭症人士，也不是必须采取的应对方式。',items:[['mei','headache'],['sam','soundPause'],['leila','glare'],['leila','lightheaded'],['mei','fatigue'],['mei','quietPause']]},
      {title:'个体情绪反应',note:'情绪会因人和情境而异；这些插图不是诊断或自闭症症状清单。',items:[['leila','tension']]},
      {title:'独立的身体健康事件',note:'发热、恶心和晕厥属于独立健康事件，不应被当作自闭症特征。',items:[['sam','fever'],['sam','nausea'],['leila','fainting']]},
      {title:'更清楚、更有动作感的角色姿势',note:'每位角色新增三个姿势，用于展示可能的身体表达与应对方式；均为虚构示例，不是自闭症症状清单。',items:[['mei','meiSensoryOverload'],['mei','meiHeadachePose'],['mei','meiSeatedRest'],['sam','samRequestPause'],['sam','samSocialUncertainty'],['sam','samNauseaPose'],['leila','leilaGlareStepback'],['leila','leilaSeatedPause'],['leila','leilaRequestHelp']]}
    ]:[
      {title:'Sensory experiences and personal strategies',note:'These are fictional individual experiences and choices, not universal autistic experiences or required coping methods.',items:[['mei','headache'],['sam','soundPause'],['leila','glare'],['leila','lightheaded'],['mei','fatigue'],['mei','quietPause']]},
      {title:'Individual emotional responses',note:'Emotions vary between people and situations; these illustrations are not a diagnosis or an autism symptom checklist.',items:[['leila','tension']]},
      {title:'Separate physical health events',note:'Fever, nausea and fainting are separate health events and should not be presented as autism traits.',items:[['sam','fever'],['sam','nausea'],['leila','fainting']]},
      {title:'More expressive character actions',note:'Each character has three additional poses showing possible body language and responses. These are fictional examples, not an autism symptom checklist.',items:[['mei','meiSensoryOverload'],['mei','meiHeadachePose'],['mei','meiSeatedRest'],['sam','samRequestPause'],['sam','samSocialUncertainty'],['sam','samNauseaPose'],['leila','leilaGlareStepback'],['leila','leilaSeatedPause'],['leila','leilaRequestHelp']]}
    ];
    root.innerHTML=groups.map(group=>`<section class="body-state-group"><h3>${escapeHTML(group.title)}</h3><p>${escapeHTML(group.note)}</p><div class="body-state-grid">${group.items.map(([personId,key])=>{const person=characters.find(c=>c.id===personId),copy=reactionCopy[key],provisional=person.provisional?(zh?' · 暂定人物':' · provisional character'):'';return `<article class="body-state-card"><canvas data-reaction-preview="${personId}:${key}" width="170" height="170" role="img" aria-label="${escapeHTML(`${person.name}: ${copy.title[zh?'zh':'en']}`)}"></canvas><div><small>${escapeHTML(`${person.name}${provisional}`)}</small><h4>${escapeHTML(copy.title[zh?'zh':'en'])}</h4><p>${escapeHTML(copy.body[zh?'zh':'en'])}</p></div></article>`}).join('')}</div></section>`).join('');
    drawReactionPreviews(root);
  }

  function currentEventCopy(event){return localizedChapter().events.find(item=>item.id===event.id)||event}
  function renderChoiceButtons(event,selectedIndex=null){
    const shown=currentEventCopy(event),previous=state.done[eventKey(event)],stale=previous&&isStaleRecord(event.id,previous),zh=state.language==='zh';
    const prompt=stale?(zh?'前面的选择已改变。请重新确认这一项，或选择其他做法；旧结果暂不计入后续回顾。':'An earlier choice has changed. Please confirm this moment again or choose another approach; its old result is not included for now.'):
      previous?(zh?`上次你选择了“${escapeHTML(shown.choices[previous.choiceIndex]?.label||'')}”。可以保留，也可以重新体验。`:`Last time you chose “${escapeHTML(shown.choices[previous.choiceIndex]?.label||'')}”. Keep it or explore another option.`):'';
    $('choiceList').innerHTML=`${prompt?`<p class="reselect-prompt">${prompt}</p>`:''}${shown.choices.map((choice,index)=>`<button type="button" class="choice" data-choice="${index}" ${selectedIndex===index||(!stale&&selectedIndex===null&&previous?.choiceIndex===index)?'aria-pressed="true"':''}><strong>${escapeHTML(choice.label)}</strong><small>${escapeHTML(choice.detail)}</small></button>`).join('')}`;
    $('choiceList').querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>makeChoice(Number(button.dataset.choice))));
  }
  function actionLabel(action,language=state.language){
    const zh=language==='zh',labels={
      notebook:zh?'拿出笔记本':'take out a notebook',examine:zh?'查看信息':'check the information',look:zh?'环顾周围':'look around',pickup:zh?'拿起物品':'pick up an item',wave:zh?'挥手示意':'wave to someone',rest:zh?'停下来休息':'pause to rest',chair:zh?'坐下来':'take a seat',phone:zh?'查看手机':'check a phone',laptop:zh?'打开电脑':'open a laptop'
    };return labels[action]||action;
  }
  function drawBranchActionPreview(root,personId,action){
    const view=root.querySelector('canvas[data-branch-action]');if(!view)return;
    const g=view.getContext('2d');g.clearRect(0,0,view.width,view.height);g.imageSmoothingEnabled=false;
    g.fillStyle='#f1ead7';g.fillRect(0,0,view.width,view.height);
    if(!drawSpriteFrame(g,personId,view.width/2,view.height-5,'down',0,view.height-10,action,false,performance.now()))drawPerson(g,view.width/2,view.height*.62,2,selectedCharacter()?.accent||'#d87857',true);
  }
  function eventSpec(event,index,language=state.language){
    const base=branchSpec[state.character]?.[event.id]?.[index]?.[language];if(!base)return null;
    const spec=JSON.parse(JSON.stringify(base));
    if(language===state.language){
      const current=currentEventCopy(event).choices[index],thought=personaThoughts[event.id]?.[state.character]?.[language==='zh'?1:0]||'';
      spec.result.selectedChoice=current.label;spec.result.detail=current.detail;spec.result.reply=current.reply;
      spec.result.text=language==='zh'?`${personaApproach[state.character].zh} ${selectedCharacter().name} 的个人想法：“${thought}” ${current.reply}`:`${personaApproach[state.character].en} ${selectedCharacter().name}’s thought: “${thought}” ${current.reply}`;
      const generic=interactionCopy[language][spec.interaction.type].prompt;
      spec.interaction.steps[0].prompt=language==='zh'?`${selectedCharacter().name} 在${eventInteractionContext[event.id].zh}时这样想：“${thought}” “${current.label}”之后，${generic}`:`${selectedCharacter().name}, while ${eventInteractionContext[event.id].en}, is thinking: “${thought}” After “${current.label}”, ${generic}`;
    }
    return spec;
  }
  function renderCompletedOutcome(event,record){
    const zh=state.language==='zh',person=selectedCharacter(),shown=currentEventCopy(event),choice=shown.choices[record.choiceIndex],spec=eventSpec(event,record.choiceIndex),stale=isStaleRecord(event.id,record);
    if(stale){$('outcomeBox').classList.remove('hidden');$('outcomeBox').innerHTML=`<strong>${zh?'需要重新确认':'Needs reconfirmation'}</strong><p>${zh?'这项结果依赖前面的选择。前面已改变，重新确认后才会纳入后续状态和结尾。':'This result depended on an earlier choice. That choice has changed; reconfirm this moment before it contributes to later context or the ending.'}</p>`;return}
    if(!spec){$('outcomeBox').classList.add('hidden');return}
    const microIndices=Array.isArray(record.microChoice)?record.microChoice:[record.microChoice??2];
    const microItems=microIndices.map(index=>spec.interaction.steps[0].options[Math.max(0,Math.min(2,index))]);
    const reply=spec.result.text;
    const response=spec.responder?.text?`<p class="response-note"><strong>${zh?'对方的回应':'Other person’s response'}:</strong> ${escapeHTML(spec.responder.text)}</p>`:'';
    const microHtml=`<section class="micro-result"><strong>${zh?'你在互动中做了什么':'Your in-game interaction'}</strong>${microItems.length?microItems.map(micro=>`<p>${escapeHTML(micro.label)} — ${escapeHTML(micro.feedback)}</p>`).join(''):`<p>${zh?'你没有勾选偏好；这个空白也被保留下来。':'No preference was selected; the blank choice is kept.'}</p>`}</section>`;
    const next=spec.downstream?.[0];
    const downstream=next?`<p class="downstream-note"><strong>${zh?'带到下一步':'Carry forward'}:</strong> ${escapeHTML(next.text)}</p>`:'';
    const reactionId=reactionForChoice(person.id,event.id,record.choiceIndex),reaction=reactionId?`<details class="optional-reaction"><summary>${zh?'可选：查看一种虚构的身体反应':'Optional: view one fictional body response'}</summary>${reactionCardMarkup(reactionId,person)}</details>`:'';
    $('outcomeBox').classList.remove('hidden');
    $('outcomeBox').innerHTML=`<div class="branch-action-row"><canvas data-branch-action width="88" height="92" role="img" aria-label="${escapeHTML(`${person.name}: ${actionLabel(spec.action.post, state.language)}`)}"></canvas><div><small>${escapeHTML(zh?'当前选择':'Current choice')}</small><strong>${escapeHTML(choice.label)}</strong><p class="action-caption">${escapeHTML(zh?`${person.name} 的动作：${actionLabel(spec.action.post)}`:`${person.name}’s action: ${actionLabel(spec.action.post)}`)}</p></div></div><p class="branch-result-text">${escapeHTML(reply)}</p>${microHtml}${response}${downstream}${reaction}<p class="meter-note">${zh?'这是一个虚构的故事结果，不会给选择打分。互动中的消息和请求也不会发送出去。':'This is a fictional story outcome, not a score. Messages and requests in the interaction are not sent.'}</p><div class="branch-result-actions"><button class="secondary-button" id="retryInteraction" type="button">${zh?'再体验这段互动':'Replay this interaction'}</button><button class="secondary-button" id="outcomeClose" type="button">${zh?'返回地图':'Back to the map'}</button></div>`;
    drawBranchActionPreview($('outcomeBox'),person.id,spec.action.post);drawReactionPreviews($('outcomeBox'));
    $('retryInteraction').addEventListener('click',()=>makeChoice(record.choiceIndex));$('outcomeClose').addEventListener('click',closeEvent);
  }
  function openEvent(e,trigger=null) {
    if(!e)return;
    state.proximityCue=null;renderProximityCue();
    clearHeldDirections();state.pendingChoice=null;
    state.event=e;state.mode='choice';state.eventTrigger=trigger||document.activeElement;
    $('taskDrawer').classList.add('hidden');$('momentsHudButton').setAttribute('aria-expanded','false');
    $('dialogStep').textContent=localizedChapter().time;
    $('dialogTitle').textContent=e.title;const carry=continuityNote(e.id);$('dialogDescription').textContent=carry?`${e.text}\n\n${carry}`:e.text;
    $('dialogInsight').textContent=state.language==='zh'?'人物内心想法 · 设计草稿，并非访谈原话':'Character thought · draft concept copy, not an interview quote';
    const p=selectedCharacter(),thought=e.thought?.[p.id],thoughtCopy=thought?.[state.language]||thought?.en||personaThoughts[e.id]?.[p.id]?.[state.language==='zh'?1:0]||(state.language==='zh'?'我会先看看眼前有什么选择，再决定下一步。':'I will look at the options here and decide what feels right for me.');
    $('dialogThought').innerHTML=`<div class="thought-avatar" id="thoughtAvatar"></div><div class="thought-bubble"><small>${escapeHTML(p.name)} · ${state.language==='zh'?'此刻在想':'thinking now'}</small><p>${escapeHTML(thoughtCopy)}</p></div>`;drawAvatar($('thoughtAvatar'),p);
    const previous=state.done[eventKey(e)];state.characterReaction=null;drawWorld();renderChoiceButtons(e);
    if(previous)renderCompletedOutcome(e,previous);else $('outcomeBox').classList.add('hidden');
    $('app').inert=true;$('eventOverlay').classList.remove('hidden');$('eventOverlay').setAttribute('aria-hidden','false');$('closeDialog').focus();
  }
  function interactionOptionFeedback(spec,index){
    const option=spec.interaction.steps[0].options[Math.max(0,Math.min(2,index))];return option||spec.interaction.defaultOnSkip;
  }
  function renderInteraction(){
    const pending=state.pendingChoice;if(!pending)return;const e=state.event,zh=state.language==='zh',spec=eventSpec(e,pending.index),step=pending.stage;
    if(!spec)return;
    $('outcomeBox').classList.remove('hidden');
    if(step===0){
      const interaction=spec.interaction,type=interaction.type,definition=interaction.steps[0];
      const isCard=type==='CARD';
      const helper=type==='MSG'?(zh?'这里只显示草稿，不会实际发送。':'This only previews a draft; nothing is sent.'):type==='ASK'?(zh?'回应是故事示例，可以不提问。':'Replies are story examples; asking is optional.'):'';
      const typeNames=zh?{ARR:'线索排序',PLC:'随身物品',NODE:'路线标记',READ:'阅读信息卡',ASK:'对话短句',LOOK:'环境观察',SEAT:'位置选择',CARD:'偏好卡',MSG:'消息草稿'}:{ARR:'Cue ordering',PLC:'Carry an item',NODE:'Route marker',READ:'Information card',ASK:'Try a phrase',LOOK:'Scene scan',SEAT:'Choose a position',CARD:'Preference card',MSG:'Message draft'};
      const visuals={
        ARR:`<div class="branch-visual visual-arr" aria-hidden="true"><span>1</span><span>2</span><span>3</span></div>`,
        PLC:`<div class="branch-visual visual-plc" aria-hidden="true"><span>🎒</span><span>▤</span><span>＋</span></div>`,
        NODE:`<div class="branch-visual visual-node" aria-hidden="true"><i></i><i></i><i></i></div>`,
        READ:'',ASK:`<div class="branch-visual visual-ask" aria-hidden="true"><span>…</span><span>“ ”</span></div>`,
        LOOK:`<div class="branch-visual visual-look" aria-hidden="true"><span>⌕</span><span>☼</span><span>↗</span></div>`,
        SEAT:`<div class="branch-visual visual-seat" aria-hidden="true"><span>□</span><span>□</span><span>□</span></div>`,
        CARD:'',MSG:`<div class="branch-visual visual-msg" aria-hidden="true"><span>▱</span><span>▱</span></div>`
      };
      const options=definition.options.map((option,index)=>isCard?`<label class="micro-card-option"><input type="checkbox" data-card-option="${index}" ${pending.selectedPrefs.includes(index)?'checked':''}><span><strong>${escapeHTML(option.label)}</strong><small>${escapeHTML(option.feedback)}</small></span></label>`:`<button type="button" class="micro-option ${pending.microChoice===index?'selected':''}" data-micro-choice="${index}" aria-pressed="${pending.microChoice===index}"><strong>${escapeHTML(option.label)}</strong><small>${escapeHTML(option.feedback)}</small></button>`).join('');
      $('outcomeBox').innerHTML=`<p class="interaction-progress">${zh?'互动 1 / 2':'Interaction 1 of 2'} · ${escapeHTML(typeNames[type])}</p><h3>${zh?'人物行动':'Character interaction'}</h3><p>${escapeHTML(definition.prompt)}</p>${visuals[type]||''}${type==='READ'?`<details class="read-card"><summary>${zh?'展开信息卡':'Open information card'}</summary><p>${escapeHTML(definition.prompt)}</p></details>`:''}${helper?`<p class="interaction-helper">${escapeHTML(helper)}</p>`:''}<div class="micro-option-list micro-type-${type.toLowerCase()} ${isCard?'micro-card-list':''}">${options}</div><div class="interaction-actions">${isCard?`<button class="primary-button" id="continueMicro" type="button">${zh?'继续，确认这些偏好':'Continue with these preferences'}</button>`:''}<button class="secondary-button" id="skipMicro" type="button">${zh?'跳过，使用默认':'Skip and use default'}</button></div>`;
      if(isCard){$('outcomeBox').querySelectorAll('[data-card-option]').forEach(input=>input.addEventListener('change',ev=>{const i=Number(ev.target.dataset.cardOption);if(ev.target.checked&&pending.selectedPrefs.length>=2){ev.target.checked=false;return}pending.selectedPrefs=ev.target.checked?[...pending.selectedPrefs,i]:pending.selectedPrefs.filter(x=>x!==i)}));$('continueMicro').addEventListener('click',()=>{pending.stage=1;pending.microChoice=pending.selectedPrefs[0]??2;renderInteraction()})}
      else $('outcomeBox').querySelectorAll('[data-micro-choice]').forEach(button=>button.addEventListener('click',()=>{pending.microChoice=Number(button.dataset.microChoice);pending.stage=1;renderInteraction()}));
      $('skipMicro').addEventListener('click',()=>commitChoice(pending.index,2,true));
    }else{
      const type=spec.interaction.type,selected=type==='CARD'?pending.selectedPrefs.map(i=>interactionOptionFeedback(spec,i)):[interactionOptionFeedback(spec,pending.microChoice??2)];
      const cards=selected.map(item=>`<li><strong>${escapeHTML(item.label)}</strong><br>${escapeHTML(item.feedback)}</li>`).join('');
      const typeNames=zh?{ARR:'线索排序',PLC:'随身物品',NODE:'路线标记',READ:'阅读信息卡',ASK:'对话短句',LOOK:'环境观察',SEAT:'位置选择',CARD:'偏好卡',MSG:'消息草稿'}:{ARR:'Cue ordering',PLC:'Carry an item',NODE:'Route marker',READ:'Information card',ASK:'Try a phrase',LOOK:'Scene scan',SEAT:'Choose a position',CARD:'Preference card',MSG:'Message draft'};
      $('outcomeBox').innerHTML=`<p class="interaction-progress">${zh?'互动 2 / 2':'Interaction 2 of 2'} · ${escapeHTML(typeNames[type])}</p><h3>${zh?'细节与回应':'Your detail and response'}</h3><p>${escapeHTML(spec.interaction.steps[1].prompt)}</p><ul class="interaction-feedback">${cards}</ul>${type==='CARD'&&pending.selectedPrefs.length===0?`<p class="interaction-helper">${zh?'你没有勾选偏好，也可以继续。':'No preference selected; you can continue.'}</p>`:''}<div class="interaction-actions"><button class="primary-button" id="confirmBranch" type="button">${zh?'确认人物行动':'Confirm character action'}</button><button class="secondary-button" id="changeMicro" type="button">${zh?'返回修改细节':'Change the detail'}</button><button class="secondary-button" id="useDefaultMicro" type="button">${zh?'使用默认并继续':'Use default and continue'}</button></div>`;
      $('confirmBranch').addEventListener('click',()=>commitChoice(pending.index,type==='CARD'?pending.selectedPrefs:(pending.microChoice??2),false));
      $('changeMicro').addEventListener('click',()=>{pending.stage=0;renderInteraction()});
      $('useDefaultMicro').addEventListener('click',()=>commitChoice(pending.index,2,true));
    }
    const focus=$('outcomeBox').querySelector('button');focus?.focus();
  }
  function makeChoice(i){
    const e=state.event;if(!e||!Number.isInteger(i)||i<0||i>=e.choices.length)return;
    const wasSame=state.done[eventKey(e)]?.choiceIndex===i;
    state.pendingChoice={eventId:e.id,index:i,stage:0,microChoice:null,selectedPrefs:[],wasSame};
    renderChoiceButtons(e,i);renderInteraction();
  }
  function commitChoice(i,microSelection=2,usedDefault=false){
    const e=state.event,p=selectedCharacter(),shown=currentEventCopy(e),c=shown.choices[i],spec=eventSpec(e,i);if(!spec)return;
    const factor=p.factors[e.category]||1,applied={...e.choices[i].effect};if(applied.load>0)applied.load=Math.round(applied.load*factor);
    const sourceSnapshot=upstreamDependencies[e.id]?upstreamChoice(e.id):null;
    const microIndices=Array.isArray(microSelection)?microSelection:[microSelection];
    state.done[eventKey(e)]={choiceIndex:i,eventId:e.id,effect:applied,microChoice:microIndices,upstreamChoiceAtCommit:sourceSnapshot};
    state.characterReaction=null;state.actionName=spec.action.post;state.actionUntil=(REDUCED||state.settings.reduceMotion)?0:performance.now()+650;
    state.actionLog.push({character:p.id,event:e.id,choice:i,action:spec.action.post,asset:spec.action.asset,language:state.language});
    state.interactionLog.push({character:p.id,event:e.id,choice:i,type:spec.interaction.type,selected:microIndices,skipped:!!usedDefault,language:state.language});
    state.pendingChoice=null;recomputeChoices();renderChoiceButtons(e,i);renderCompletedOutcome(e,state.done[eventKey(e)]);
    renderMeters();renderTasks();drawWorld();
    const first=$('outcomeBox').querySelector('button');first?.focus();
  }

  function recomputeChoices(){state.meters={...BASE_METERS};state.journal=[];chapters.forEach((ch,chapterIndex)=>ch.events.forEach(event=>{const record=state.done[`${ch.id}:${event.id}`];if(!record||isStaleRecord(event.id,record))return;Object.entries(record.effect||{}).forEach(([key,value])=>{state.meters[key]=clamp(state.meters[key]+value)});state.journal.push({chapterId:ch.id,chapterIndex,eventId:event.id,choiceIndex:record.choiceIndex})}))}
  function closeEvent(){const trigger=state.eventTrigger;state.event=null;state.eventTrigger=null;$('eventOverlay').classList.add('hidden');$('eventOverlay').setAttribute('aria-hidden','true');$('app').inert=false;if(trigger?.isConnected&&trigger.focus&&!trigger.closest('#taskDrawer')&&!trigger.closest('#proximityCue'))trigger.focus();else $('momentsHudButton').focus();drawWorld()}
  function nextChapter(){if(completedCount()<chapter().required)return;$('taskDrawer').classList.add('hidden');$('momentsHudButton').setAttribute('aria-expanded','false');if(state.chapter===chapters.length-1){showEnding();return;}state.chapter++;state.ambientLoad=0;state.proximityCue=null;if(chapter().scene==='route'){routeAmbient.dogBarkAt=0;routeAmbient.dogBarkTriggered=false;routeAmbient.constructionTriggered=false;routeAmbient.dogX=null;routeAmbient.dogY=null}state.player={...chapter().start};state.homeIntro='ready';state.actionName='';state.actionUntil=0;state.characterReaction=null;renderChapter();}
  function showEnding(){
    showScreen('endingScreen');localizeStatic();const endingSprite=ART.sprites[state.character];if(endingSprite?.actionSrc)$('endingRestCharacter').style.backgroundImage=`url("${endingSprite.actionSrc}")`;
    const p=selectedCharacter(),zh=state.language==='zh',flags=deriveFlags();
    const items=chapters.map(ch=>{
      const view=localizedChapter(ch),rows=ch.events.map(event=>{
        const key=`${ch.id}:${event.id}`,record=state.done[key];if(!record)return '';
        const shown=view.events.find(x=>x.id===event.id),choice=shown.choices[record.choiceIndex],spec=eventSpec(event,record.choiceIndex);
        if(isStaleRecord(event.id,record))return `<li><strong>${escapeHTML(shown.title)}</strong> — ${zh?'前面选择已改变，需要重新确认':'Earlier choice changed; needs reconfirmation'}</li>`;
        const note=spec?.ending?.note||'';
        const microIndices=Array.isArray(record.microChoice)?record.microChoice:[record.microChoice??2];
        const micro=microIndices.map(i=>spec?.interaction?.steps?.[0]?.options?.[i]?.label).filter(Boolean).join(zh?'、':', ');
        const interactionSummary=micro||(zh?'没有勾选偏好':'left preferences open');
        return `<li><strong>${escapeHTML(shown.title)}</strong> — ${zh?'你做了：':'You chose: '}${escapeHTML(choice.label)}. ${zh?'互动：':'Interaction: '}${escapeHTML(interactionSummary)}. <span>${escapeHTML(note)}</span></li>`;
      }).filter(Boolean);
      return `<li class="ending-chapter"><strong>${escapeHTML(view.title)}</strong><ul>${rows.length?rows.join(''):`<li>${zh?'本章未探索':'No moments explored'}</li>`}</ul></li>`;
    }).join('');
    const carry=Object.keys(flags).map(flag=>flagLabels[flag]?.[state.language]).filter(Boolean);
    $('daySummary').innerHTML=`<h2>${p.name}${zh?'的一天':'’s path through the day'}</h2><p>${zh?'你做了什么、带走了什么信息，以及哪些选择仍然开放：':'What you did, what information you carried forward, and which choices remain open:'}</p><ul class="ending-chapters">${items}</ul><p class="meter-note">${zh?`共探索 ${state.journal.length} 个时刻。没有最终评分。`:`You explored ${state.journal.length} moments across five chapters. There is no final score.`}</p>`;
  }

  function drawPerson(g,x,y,scale=1,color='#d87857',faceFront=false,hairKey=state.hair){
    const q=(dx,dy,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x+dx*scale),Math.round(y+dy*scale),w*scale,h*scale)};
    const hair=hairColors[hairKey],coat=color;
    q(-5,-11,10,4,hair);q(-6,-7,12,8,hair);q(-4,-6,8,7,'#d9a978');q(-5,1,10,8,coat);q(-4,9,3,4,'#293849');q(1,9,3,4,'#293849');q(-7,2,2,5,'#d9a978');q(5,2,2,5,'#d9a978');
    if(faceFront){q(-2,-3,1,1,'#253136');q(2,-3,1,1,'#253136')}else q(2,-3,1,1,'#253136');
  }
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function line(x,y,w,h,c){rect(x,y,w,h,c)}
  function tile(x,y,w,h,c){rect(x*TILE,y*TILE,w*TILE,h*TILE,c)}
  function pattern(base,grid){rect(0,0,960,576,base);ctx.strokeStyle=grid;ctx.lineWidth=1;for(let x=0;x<=960;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,576);ctx.stroke()}for(let y=0;y<=576;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke()}}
  function tree(x,y){rect(x-11,y+1,22,27,'#76583b');rect(x-28,y-30,56,38,'#356f50');rect(x-18,y-43,38,22,'#4e9458');rect(x-24,y-25,12,9,'#79ae6b');rect(x+9,y-31,11,10,'#79ae6b')}
  function bench(x,y){rect(x-23,y-8,46,17,'#a36c3c');rect(x-21,y-7,42,4,'#ce9a57');rect(x-18,y+9,5,9,'#424c49');rect(x+13,y+9,5,9,'#424c49')}
  function plant(x,y){rect(x-9,y+2,18,15,'#aa7754');rect(x-12,y-13,24,19,'#568f54');rect(x-4,y-22,10,15,'#83b96c')}
  function table(x,y){rect(x-26,y-11,52,24,'#a6724b');rect(x-23,y-9,46,4,'#d9a573');rect(x-19,y+13,5,11,'#555149');rect(x+14,y+13,5,11,'#555149')}
  function npc(x,y,color='#5877a9'){drawPerson(ctx,x,y,1.6,color,false,'brown')}
  function drawHome(){pattern('#bd8756','#ab774c');tile(0,0,30,2,'#6f5c4b');tile(9,10,10,5,'#d7ad7b');tile(10,11,8,3,'#eed4a3');tile(2,4,7,6,'#825641');tile(2.5,4.4,6,4.8,'#eedcb6');tile(3,6,5,3,'#d3754f');tile(20,4,7,3,'#7c573b');tile(21,4.3,5,2,'#c8945f');rect(700,146,95,30,'#344d54');rect(710,151,75,19,'#bdcbd0');tile(8,2,7,3,'#406374');tile(8.3,2.2,6.4,2.3,'#a5d4db');tile(8.3,4.1,6.4,.3,'#70a65e');tile(25,13,2,4,'#6e4e3b');tile(25.2,13.3,1.6,3,'#e0bd81');plant(865,260);plant(110,90);tile(13,15,5,2,'#71513e');tile(13.5,15.3,4,1.4,'#ad7a55')}
  function drawRoute(){pattern('#73a36c','#6d9a66');tile(0,10,30,4,'#d9c4a0');tile(0,11,30,1,'#c9b391');tile(0,14,30,4,'#5b6365');for(let i=0;i<7;i++)tile(i*5,16,2,.14,'#d9d8bd');tile(0,2,5,8,'#8e9c92');tile(.4,2.4,4.2,4.6,'#bdd2cd');tile(.4,7,4.2,.4,'#3c5153');for(let i=0;i<4;i++){tile(1+i,4,.55,1,'#688b8c')}tile(24,1,6,9,'#a7a995');tile(24.5,2,5,5,'#83aaa9');for(let i=0;i<4;i++)tile(25+i,3,.7,2,'#b9d2d0');tree(355,165);tree(645,120);tree(790,290);bench(751,250);npc(295,365);npc(573,360);npc(805,362);rect(425,475,75,34,'#d48256');rect(440,465,30,12,'#d8e4dc');rect(435,507,12,9,'#292d2e');rect(480,507,12,9,'#292d2e');rect(590,480,10,75,'#e7dfb2');rect(620,480,10,75,'#e7dfb2');rect(650,480,10,75,'#e7dfb2');plant(670,286)}
  function drawAtrium(){pattern('#d5c2a5','#c1af95');tile(0,0,30,3,'#607b7d');for(let i=0;i<9;i++){tile(i*3.5,0,.3,3,'#36545a')}tile(0,3,4,13,'#c9ad87');tile(26,3,4,13,'#c9ad87');tile(4,3,22,12,'#e9d9bd');tile(4,12,22,3,'#dbc2a4');for(let i=0;i<4;i++){tile(7+i*5,3,.5,9,'#8b9a92')}tile(0,6,6,3,'#8d704e');tile(.5,6.3,5,2.3,'#c49660');rect(38,201,90,17,'#f5e8c9');tile(20,3,7,3,'#9cad9e');tile(20.4,3.3,6.2,2.3,'#547987');tile(23,5,3,.4,'#e7cb81');tile(9,10,11,2,'#b4b39e');tile(10,10.2,9,1.6,'#d3d3b9');plant(190,360);plant(825,365);npc(220,300);npc(585,268);tile(13,15,4,3,'#6f8e91');tile(13.5,15.2,3,2,'#a9c7c5')}
  function drawClassroom(){pattern('#bd946e','#ad8562');tile(0,0,30,3,'#6c7770');tile(3,0,12,3,'#86bac5');for(let i=0;i<4;i++)tile(4+i*3,0,.2,3,'#e4e6d5');tile(18,1,9,2,'#e9e2c9');tile(18.3,1.3,8.4,1.4,'#f8f5e9');for(let i=0;i<4;i++){table(175+i*187,253);table(175+i*187,402)}tile(12,6,7,6,'#d8ad78');tile(12.4,6.5,6.2,5,'#eee0b8');npc(610,185);npc(350,266);npc(710,397);tile(22,4,5,2,'#ac8c68');tile(22.5,4.3,4,1.3,'#e1ce9e');plant(870,280);plant(70,295);tile(13,15,4,3,'#715742');tile(13.5,15.3,3,2.4,'#c59f6f')}
  function drawLunch(){pattern('#d9c9ad','#c9b99e');tile(0,0,13,5,'#977355');tile(0,4,13,2,'#d0a16c');for(let i=0;i<7;i++)tile(.6+i*1.7,3.6,1,.5,'#e4d9b6');tile(19,0,11,18,'#81a578');tile(19,9,11,9,'#94b67e');tile(20,4,9,6,'#d8c4a0');tree(750,136);tree(898,353);bench(676,282);bench(825,281);for(let i=0;i<3;i++){table(140+i*180,277)}tile(21,11,7,4,'#d4bea2');tile(21.5,11.5,6,3,'#f1e3c4');npc(318,325);npc(460,252);npc(850,440);plant(490,130);plant(590,390)}
  function drawArt(img){
    const cw=canvas.width,ch=canvas.height,k=Math.max(cw/img.width,ch/img.height),w=img.width*k,h=img.height*k;
    ctx.imageSmoothingEnabled=img.width>cw;ctx.imageSmoothingQuality='high';ctx.drawImage(img,Math.round((cw-w)/2),Math.round((ch-h)/2),Math.round(w),Math.round(h));ctx.imageSmoothingEnabled=false;
  }
  function drawSpriteFrame(g,id,cx,footY,dir='down',col=0,h=ART.spriteHeight,action='',walking=false,now=performance.now()){
    const s=ART.sprites[id];if(!s||!s.img)return false;
    const rowMap={down:0,left:1,right:2,up:3},actionMap={lying:[0,0],wakeEyes:[1,0],wakeSit:[2,0],wakeStand:[3,0],pickup:[0,1],examine:[1,1],look:[1,1],notebook:[2,1],wave:[3,1],rest:[0,2],chair:[1,2],phone:[2,2],laptop:[3,2]};
    const poseDef=actionMap[action]||s.actionMap?.[action],pose=poseDef&&s.actionImg?poseDef:null;
    const img=pose&&s.actionImg?s.actionImg:walking&&s.walkImg?s.walkImg:s.img;
    const cols=img===s.actionImg?(s.actionCols||4):img===s.walkImg?(s.walkCols||4):(s.cols||1);
    const rows=img===s.actionImg?(s.actionRows||3):img===s.walkImg?(s.walkRows||4):(s.rows||1);
    const fw=img.width/cols,fh=img.height/rows;
    const frame=walking&&!pose?Math.floor(now/150)%cols:Math.max(0,Math.min(cols-1,Number(col)||0));
    const row=pose?pose[1]:rows>=4?(rowMap[dir]||0):0,cell=pose?pose[0]:frame,flip=!pose&&img===s.img&&rows<4&&dir==='left';
    const walkCrop=img===s.walkImg&&s.walkCrops?.[row],crop=img===s.img?(s.crop||{x:0,y:0,w:fw,h:fh}):walkCrop?{x:walkCrop[0],y:walkCrop[1],w:walkCrop[2],h:walkCrop[3]}:{x:0,y:0,w:fw,h:fh};
    const sx=cell*fw+crop.x,sy=row*fh+crop.y,sw=crop.w,sh=crop.h,dh=h||ART.spriteHeight,dw=dh*sw/sh;
    g.save();g.imageSmoothingEnabled=false;
    if(flip){g.translate(Math.round(cx),0);g.scale(-1,1);g.drawImage(img,sx,sy,sw,sh,Math.round(-dw/2),Math.round(footY-dh),Math.round(dw),Math.round(dh))}
    else g.drawImage(img,sx,sy,sw,sh,Math.round(cx-dw/2),Math.round(footY-dh),Math.round(dw),Math.round(dh));
    g.restore();return true;
  }
  function drawReactionFrame(g,id,reactionKey,cx,footY,h){
    const cfg=ART.sprites[id]?.reactions?.[reactionKey],img=ART.sprites[id]?.reactionImages?.[reactionKey];if(!cfg||cfg.mapPose===false||!img)return false;
    const dh=h||ART.spriteHeight,dw=dh*img.width/img.height*(cfg.widthScale||1);
    g.save();g.imageSmoothingEnabled=false;g.drawImage(img,Math.round(cx-dw/2),Math.round(footY-dh),Math.round(dw),Math.round(dh));g.restore();return true;
  }
  // World characters use the original pixel colours and an optional 2D frame sheet.
  function drawPlayer(){
    const sceneKey=chapter().scene,sceneArt=ART.scenes[sceneKey]||{},bounds=ART.bounds[sceneKey]||{x0:1,x1:28,y0:3,y1:16};
    const px=Math.round(state.player.x*TILE),py=Math.round(state.player.y*TILE),now=performance.now();
    if(state.chapter===0&&(state.homeIntro==='sleeping'||state.homeIntro==='waking'))return drawHomeIntro(now,sceneArt);
    const depth=Math.max(0,Math.min(1,(state.player.y-bounds.y0)/Math.max(1,bounds.y1-bounds.y0)));
    const perspective=sceneArt.perspective||{},farScale=perspective.far??.82,nearScale=perspective.near??1;
    const personHeight=(sceneArt.playerHeight||ART.spriteHeight)*(farScale+(nearScale-farScale)*depth),footY=py+(sceneArt.groundOffset??16);
    const moving=state.keys.size>0||state.touchKeys.size>0||now-(state.lastMove||0)<170,action=now<state.actionUntil?state.actionName:!moving&&now<state.autoLookUntil?'look':state.resting?'rest':now<state.waveUntil?'wave':state.carrying?'notebook':'';
    const shadowW=Math.max(16,Math.round(personHeight*.31)),shadowH=Math.max(3,Math.round(personHeight*.07));
    ctx.fillStyle='rgba(43,32,23,.20)';ctx.fillRect(px-Math.round(shadowW/2),footY-shadowH,shadowW,shadowH);ctx.fillStyle='rgba(43,32,23,.32)';ctx.fillRect(px-Math.round(shadowW*.28),footY-shadowH-2,Math.round(shadowW*.56),2);
    if(!drawReactionFrame(ctx,state.character,state.characterReaction,px,footY,personHeight))drawSpriteFrame(ctx,state.character,px,footY,state.facing||'down',0,personHeight,action,moving,now);
  }

  function drawHomeIntro(now,sceneArt){
    const bed=sceneArt.bedIntro||{x:5,y:12,height:54},px=Math.round((bed.x??5)*TILE),py=Math.round((bed.y??12)*TILE),height=bed.height||54;
    const pose=state.homeIntro==='sleeping'?'lying':state.wakePhase==='sit'?'wakeSit':'wakeStand';
    ctx.fillStyle='rgba(43,32,23,.16)';ctx.fillRect(px-25,py-2,50,4);
    const sprite=ART.sprites[state.character];
    if(sprite?.actionImg)drawSpriteFrame(ctx,state.character,px,py,'down',0,pose==='lying'?226:height,pose,false,now);
    else if(state.homeIntro==='sleeping'){
      ctx.save();ctx.translate(px,py-13);ctx.rotate(-Math.PI/2);drawSpriteFrame(ctx,state.character,0,0,'down',0,height,'',false,now);ctx.restore();
    }else drawSpriteFrame(ctx,state.character,px,py,'down',0,height,'',false,now);
    /* Repaint the bed's own checked duvet over the sleeping body. Reusing the source art
       keeps the blanket's shape, fabric texture and perspective exact. */
    if(state.homeIntro==='sleeping'){
      const img=ART.imgs.home,poly=sceneArt.duvetSourcePolygon;
      if(img&&poly?.length>=3){
        const k=Math.max(canvas.width/img.width,canvas.height/img.height),dw=img.width*k,dh=img.height*k,dx=(canvas.width-dw)/2,dy=(canvas.height-dh)/2;
        ctx.save();ctx.beginPath();poly.forEach(([sx,sy],i)=>{const x=dx+sx*k,y=dy+sy*k;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.clip();
        ctx.imageSmoothingEnabled=img.width>canvas.width;ctx.imageSmoothingQuality='high';ctx.drawImage(img,dx,dy,dw,dh);ctx.imageSmoothingEnabled=false;ctx.restore();
      }
    }
  }
  function drawMarker(e){
    const x=Math.round(e.x*TILE),y=Math.round(e.y*TILE),done=!!state.done[eventKey(e)],d=distance(e,state.player);
    if(state.proximityCue?.key===eventKey(e)&&(state.proximityCue.source==='moment'||(state.proximityCue.source==='dog'&&e.id==='park'))){
      const age=performance.now()-state.proximityCue.createdAt,wave=(REDUCED||state.settings.reduceMotion)?0:(age%1500)/1500;
      ctx.save();ctx.strokeStyle='#fff0c8';ctx.lineWidth=2;ctx.globalAlpha=(REDUCED||state.settings.reduceMotion)?.55:.28+(1-wave)*.34;ctx.beginPath();ctx.ellipse(x,y-4,21+wave*9,9+wave*5,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    const bob=(REDUCED||done)?0:Math.round(Math.sin(performance.now()/380+e.x)*3),top=y-50+bob;
    rect(x-13,top,26,26,'#3a2415');rect(x-10,top+3,20,20,done?'#8fc17a':'#f4cf6a');rect(x-10,top+3,20,4,done?'#b7dca3':'#fbe7a2');rect(x-3,top+26,6,4,'#3a2415');rect(x-1,top+28,2,4,'#3a2415');
    ctx.fillStyle='#3a2415';ctx.font="bold 18px 'Pixelify Sans',monospace";ctx.textAlign='center';ctx.fillText(done?'✓':'!',x,top+20);
    if(d<5||ART.debug){const t=e.title+(d<3.1&&!done?(state.language==='zh'?'  [E 查看]':'  [E · OPTIONS]'):'');ctx.font="bold 14px 'Pixelify Sans','DM Sans',Arial";const w=Math.round(ctx.measureText(t).width)+16,lx=Math.max(w/2+4,Math.min(956-w/2,x));rect(lx-w/2,top-24,w,20,'#3a2415');rect(lx-w/2+2,top-22,w-4,16,'#f6e3b4');ctx.fillStyle='#3a2415';ctx.fillText(t,lx,top-9)}
    ctx.textAlign='left';
  }
  function drawAmbientThought(now){
    const cue=state.proximityCue;if(!cue||now-cue.createdAt>1700)return;
    const x=Math.round(state.player.x*TILE+23),y=Math.round(state.player.y*TILE+(ART.scenes[chapter().scene]?.groundOffset??16)-ART.spriteHeight*.78);
    const drift=(REDUCED||state.settings.reduceMotion)?0:Math.sin((now-cue.createdAt)/420)*2;
    ctx.save();ctx.globalAlpha=.92;ctx.fillStyle='#fff0c8';ctx.strokeStyle='#3a2415';ctx.lineWidth=2;ctx.beginPath();ctx.rect(x-11,y-10+drift,23,20);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-3,y+9+drift);ctx.lineTo(x-8,y+16+drift);ctx.lineTo(x+2,y+10+drift);ctx.fill();ctx.stroke();ctx.fillStyle='#3a2415';ctx.font="bold 13px 'Pixelify Sans',monospace";ctx.textAlign='center';ctx.fillText('…',x,y+4+drift);ctx.restore();
  }
  function drawDebugGrid(){
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;
    for(let i=0;i<=30;i++){ctx.beginPath();ctx.moveTo(i*TILE+.5,0);ctx.lineTo(i*TILE+.5,576);ctx.stroke()}
    for(let j=0;j<=18;j++){ctx.beginPath();ctx.moveTo(0,j*TILE+.5);ctx.lineTo(960,j*TILE+.5);ctx.stroke()}
    ctx.fillStyle='#fff';ctx.font='10px monospace';for(let i=0;i<30;i+=2)for(let j=0;j<18;j+=2)ctx.fillText(i+','+j,i*TILE+2,j*TILE+11);
    const scene=ART.scenes[chapter().scene],zones=scene?.walkableZones?.filter(z=>z.points?.length)||[];
    zones.forEach(zone=>{ctx.save();ctx.strokeStyle='#ffeb3b';ctx.fillStyle='rgba(255,235,59,.09)';ctx.lineWidth=2;ctx.beginPath();zone.points.forEach(([x,y],i)=>i?ctx.lineTo(x*TILE,y*TILE):ctx.moveTo(x*TILE,y*TILE));ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()});
    const footX=state.player.x*TILE,footY=state.player.y*TILE+(scene?.groundOffset??16);ctx.save();ctx.fillStyle='#ff3b30';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(footX,footY,6,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 13px monospace';ctx.fillText(`foot ${state.player.x.toFixed(1)}, ${state.player.y.toFixed(1)}`,Math.min(footX+10,800),Math.max(16,footY-10));ctx.restore();
  }
  function drawAmbientSprite(img,cx,footY,w,h,rotation=0,alpha=1,flip=false){if(!img)return;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.translate(Math.round(cx),Math.round(footY-h/2));if(rotation)ctx.rotate(rotation);if(flip)ctx.scale(-1,1);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();ctx.imageSmoothingEnabled=false}
  function drawSoftWaves(x,y,now,phase=0){const drift=REDUCED||state.settings.reduceMotion?0:((now/900+phase)%1);ctx.save();ctx.strokeStyle='rgba(245,204,119,.35)';ctx.lineWidth=2;for(let i=0;i<3;i++){const r=7+i*8+drift*6;ctx.globalAlpha=Math.max(.07,.24-i*.05-drift*.07);ctx.beginPath();ctx.arc(x,y,r,Math.PI*1.18,Math.PI*1.82);ctx.stroke()}ctx.restore()}
  function drawAmbientRoute(now){
    if(chapter().scene!=='route')return;
    const images=ART.ambientImages,reduced=REDUCED||state.settings.reduceMotion;
    const travel=(period,offset=0,reverse=false)=>{if(reduced)return reverse?0.76:0.24;const p=((now+offset)%period)/period;return reverse?1-p:p};
    const vehicles=[
      {frame:0,period:2700,offset:0,reverse:false,y:137,w:84,h:47},
      {frame:1,period:3000,offset:2400,reverse:true,y:157,w:94,h:50},
      {frame:2,period:2500,offset:1450,reverse:false,y:177,w:108,h:52},
      {frame:0,period:3200,offset:1680,reverse:true,y:147,w:76,h:43}
    ];
    const roadStart=210,roadSpan=440;
    vehicles.forEach(v=>{const progress=((now+v.offset)%v.period)/v.period,x=roadStart+travel(v.period,v.offset,v.reverse)*roadSpan,alpha=reduced?1:Math.min(1,progress*9,(1-progress)*9);drawAmbientFrame(images.vehicleSheet,ART.ambientFrameBounds.vehicleSheet,v.frame,3,x,v.y,v.w,v.h,v.reverse,alpha);if(!images.vehicleSheet)drawAmbientSprite(images.car,x,v.y,v.w,v.h,0,alpha,v.reverse)});
    const digPhase=reduced?0.5:(now%3200)/3200;
    const segment=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)));
    const smooth=v=>v*v*(3-2*v);
    let armAngle=0;
    if(digPhase<.30)armAngle=.68+(-.38-.68)*smooth(segment(digPhase,0,.30));
    else if(digPhase<.46)armAngle=-.38;
    else if(digPhase<.76)armAngle=-.38+(.72+.38)*smooth(segment(digPhase,.46,.76));
    else armAngle=.72;
    const bodyX=900,bodyFoot=230,bodyW=80,bodyH=70,pivotX=bodyX-bodyW*.39,pivotY=bodyFoot-bodyH*.67,armW=68,armH=39;
    const bucketX=pivotX-armW*.88*Math.cos(armAngle),bucketY=pivotY-armW*.88*Math.sin(armAngle);
    ctx.save();ctx.beginPath();ctx.moveTo(718,169);ctx.lineTo(950,169);ctx.lineTo(950,235);ctx.lineTo(920,228);ctx.lineTo(880,216);ctx.lineTo(840,203);ctx.lineTo(800,190);ctx.lineTo(760,178);ctx.closePath();ctx.clip();
    drawAmbientSprite(images.excavatorBody,bodyX,bodyFoot,bodyW,bodyH);
    if(images.excavatorArm){ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.translate(Math.round(pivotX),Math.round(pivotY));ctx.rotate(armAngle);ctx.drawImage(images.excavatorArm,-armW+4,-armH*.54,armW,armH);ctx.restore();ctx.imageSmoothingEnabled=false}
    if(!reduced&&digPhase>.34&&digPhase<.49){const scoop=(digPhase-.34)/.15;ctx.save();ctx.globalAlpha=.58;for(let i=0;i<4;i++){const rise=(scoop+i*.18)%1;ctx.fillStyle=i%2?'#ac7649':'#d49a5b';ctx.fillRect(Math.round(bucketX-5+rise*12+i*2),Math.round(bucketY+4-rise*11),3,3)}ctx.restore()}
    ctx.restore();
    drawSoftWaves(bucketX,bucketY,now,.2);
    const walkerPeriod=5400,half=walkerPeriod/2,walkerT=reduced?0.5:(now%walkerPeriod<half?(now%walkerPeriod)/half:1-(now%walkerPeriod-half)/half),walkerDirection=reduced?1:(now%walkerPeriod<half?1:-1),walkerX=625+walkerT*205,walkerFoot=239,dogFoot=244,dogIdleX=walkerX+walkerDirection*48;
    const playerX=state.player.x*TILE,playerY=state.player.y*TILE+16;
    const toPlayerX=playerX-dogIdleX,toPlayerY=playerY-dogFoot,dist=Math.hypot(toPlayerX,toPlayerY);
    const sceneInteractive=!state.paused&&!state.event&&$('taskDrawer').classList.contains('hidden')&&$('infoOverlay').classList.contains('hidden');
    const constructionDistance=Math.hypot(playerX-900,playerY-215);
    if(sceneInteractive&&!routeAmbient.constructionTriggered&&constructionDistance<132){
      routeAmbient.constructionTriggered=true;
      const streetEvent=chapter().events.find(event=>event.id==='street');
      if(streetEvent)revealProximityCue(streetEvent,{force:true,source:'construction',anchor:{x:state.player.x,y:state.player.y},description:{en:'Construction activity adds a sound cue beside this illustrated route. The scene stays in motion; no sound plays unless you opt in.',zh:'虚构路线旁出现施工声线索。场景会继续运行；除非你主动开启，游戏不会播放声音。'}});
    }
    if(sceneInteractive&&!routeAmbient.dogBarkTriggered&&dist<126){
      routeAmbient.dogBarkTriggered=true;routeAmbient.dogBarkAt=now;
      const dogEvent=chapter().events.find(event=>event.id==='park');
      const barkThoughts={mei:{en:'The bark came suddenly. I can pause or choose how to pass.',zh:'狗叫来得很突然。我可以暂停，也可以自己决定怎么经过。'},sam:{en:'I want a little space before I decide how to pass.',zh:'我想先留出一点距离，再决定怎么经过。'},leila:{en:'That sudden bark caught my attention. I can pause or move on.',zh:'突如其来的狗叫吸引了我的注意；我可以暂停，也可以继续。'}};
      if(dogEvent)revealProximityCue(dogEvent,{force:true,source:'dog',anchor:{x:state.player.x,y:state.player.y},description:{en:'A dog barks nearby. The dog and walker animate, while sound stays optional and off by default.',zh:'附近的狗叫了一声，狗和行人会继续动作；声音是可选的，默认关闭。'},thought:barkThoughts[state.character]});
      playDogBark();
    }
    const elapsed=routeAmbient.dogBarkAt?now-routeAmbient.dogBarkAt:Infinity,activeChase=!reduced&&elapsed<2100;
    let dogX=dogIdleX;
    if(activeChase&&Math.abs(playerY-dogFoot)<72){const reach=elapsed<650?Math.min(1,elapsed/650):elapsed<1150?1:Math.max(0,1-(elapsed-1150)/950),eased=smooth(reach),wanted=playerX-(Math.sign(toPlayerX)||walkerDirection)*42,leashLimited=Math.max(walkerX-66,Math.min(walkerX+66,wanted));dogX=dogIdleX+(leashLimited-dogIdleX)*eased}
    const frame=Math.floor(now/145)%4,barkPose=routeAmbient.dogBarkTriggered&&(reduced?elapsed<700:activeChase&&elapsed<1050&&Math.floor(elapsed/175)%2===0);
    routeAmbient.dogX=dogX;routeAmbient.dogY=dogFoot;
    routeActors.push({footY:Math.max(walkerFoot,dogFoot),draw:()=>{
      const leashStart=walkerX+walkerDirection*11,leashEnd=dogX-Math.sign(dogX-walkerX)*11;
      ctx.save();ctx.strokeStyle=activeChase&&elapsed<1200?'#704934':'#8e6440';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(leashStart,walkerFoot-20);ctx.lineTo(leashEnd,dogFoot-12);ctx.stroke();ctx.restore();
      const walkFrame=walkerDirection<0?(4-frame)%4:frame;
      if(images.pedestrianWalkSheet)drawAmbientFrame(images.pedestrianWalkSheet,ART.ambientFrameBounds.pedestrianWalkSheet,walkFrame,4,walkerX,walkerFoot,38,68,walkerDirection<0);else drawAmbientSprite(images.pedestrian,walkerX,walkerFoot,29,68,0,1,walkerDirection<0);
      const dogDir=(barkPose?Math.sign(playerX-dogX):Math.sign(dogX-walkerX))||walkerDirection;
      if(barkPose)drawAmbientSprite(images.dogBark,dogX,dogFoot,41,38,0,1,dogDir<0);
      else if(images.dogWalkCycle)drawAmbientFrame(images.dogWalkCycle,ART.ambientFrameBounds.dogWalkCycle,dogDir<0?(4-frame)%4:frame,4,dogX,dogFoot,44,38,dogDir<0);else drawAmbientSprite(images.dogWalk,dogX,dogFoot,38,37,0,1,dogDir<0);
      if(activeChase&&elapsed<1050)drawSoftWaves(dogX-7,dogFoot-24,now,.5);
      const canInteract=Math.hypot(state.player.x-dogX/TILE,state.player.y-(dogFoot-16)/TILE)<4.8;
      if(canInteract){const label=state.language==='zh'?'附近的情境':'SCENE CUE';ctx.font="bold 12px 'Pixelify Sans',monospace";ctx.textAlign='center';const width=Math.ceil(ctx.measureText(label).width)+14;rect(dogX-width/2,dogFoot-63,width,19,'#3a2415');rect(dogX-width/2+2,dogFoot-61,width-4,15,'#f6e3b4');ctx.fillStyle='#3a2415';ctx.fillText(label,dogX,dogFoot-49);ctx.textAlign='left'}
    }});
  }
  function ensureAmbientAudio(){
    const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return false;
    if(!ambientAudio){ambientAudio=new AudioCtor();const sampleRate=ambientAudio.sampleRate,buffer=ambientAudio.createBuffer(1,sampleRate*2,sampleRate),data=buffer.getChannelData(0);let brown=0;for(let i=0;i<data.length;i++){brown=(brown+.035*(Math.random()*2-1))*.985;data[i]=brown*2.5}const source=ambientAudio.createBufferSource(),filter=ambientAudio.createBiquadFilter();ambientNoiseGain=ambientAudio.createGain();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=260;ambientNoiseGain.gain.value=0;source.connect(filter).connect(ambientNoiseGain).connect(ambientAudio.destination);source.start()}
    if(ambientAudio.state==='suspended')ambientAudio.resume().catch(()=>{});return true;
  }
  function syncAmbientAudio(){
    if(!ambientAudio)return;
    const active=state.settings.ambientSound&&state.screen==='gameScreen'&&chapter().scene==='route'&&!state.paused&&!document.hidden&&$('infoOverlay').classList.contains('hidden'),target=active?0.075:0;
    if(target!==ambientAudioTarget){ambientAudioTarget=target;ambientNoiseGain.gain.setTargetAtTime(target,ambientAudio.currentTime,target?0.9:0.12)}
  }
  document.addEventListener('visibilitychange',syncAmbientAudio);
  function playDogBark(){if(!state.settings.ambientSound||!ensureAmbientAudio())return;const sampleRate=ambientAudio.sampleRate,length=Math.floor(sampleRate*.18),buffer=ambientAudio.createBuffer(1,length,sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<length;i++){const envelope=Math.exp(-i/(sampleRate*.045));samples[i]=(Math.random()*2-1)*envelope}for(let i=0;i<2;i++){const start=ambientAudio.currentTime+i*.24,noise=ambientAudio.createBufferSource(),band=ambientAudio.createBiquadFilter(),noiseGain=ambientAudio.createGain(),tone=ambientAudio.createOscillator(),toneFilter=ambientAudio.createBiquadFilter(),toneGain=ambientAudio.createGain();noise.buffer=buffer;band.type='bandpass';band.frequency.value=760;band.Q.value=.8;noiseGain.gain.setValueAtTime(.0001,start);noiseGain.gain.linearRampToValueAtTime(.10,start+.018);noiseGain.gain.exponentialRampToValueAtTime(.0001,start+.16);tone.type='sawtooth';tone.frequency.setValueAtTime(150,start);tone.frequency.exponentialRampToValueAtTime(76,start+.14);toneFilter.type='lowpass';toneFilter.frequency.value=620;toneGain.gain.setValueAtTime(.0001,start);toneGain.gain.linearRampToValueAtTime(.035,start+.02);toneGain.gain.exponentialRampToValueAtTime(.0001,start+.16);noise.connect(band).connect(noiseGain).connect(ambientAudio.destination);tone.connect(toneFilter).connect(toneGain).connect(ambientAudio.destination);noise.start(start);noise.stop(start+.18);tone.start(start);tone.stop(start+.18)}}
  // Portrait camera changes presentation only; world coordinates and story remain unchanged.
  let portraitOverview = false;
  const portraitQuery = window.matchMedia('(max-width: 700px) and (orientation: portrait)');
  function updatePortraitCamera(){
    const viewport=$('portraitViewport');
    if(!portraitQuery.matches){canvas.removeAttribute('style');return;}
    const w=viewport.clientWidth,h=viewport.clientHeight;
    if(!w||!h)return;
    const scale=portraitOverview?Math.min(w/canvas.width,h/canvas.height):Math.max(w/canvas.width,h/canvas.height);
    const dw=canvas.width*scale,dh=canvas.height*scale;
    const px=state.player.x*TILE,py=state.player.y*TILE;
    const left=dw<=w?(w-dw)/2:Math.max(w-dw,Math.min(0,w/2-px*scale));
    const top=dh<=h?(h-dh)/2:Math.max(h-dh,Math.min(0,h/2-py*scale));
    canvas.style.cssText=`width:${dw}px!important;height:${dh}px!important;left:${left}px!important;top:${top}px!important;transform:none!important;`;
  }
  $('mapOverview').addEventListener('click',()=>{portraitOverview=!portraitOverview;$('mapOverview').setAttribute('aria-pressed',String(portraitOverview));$('mapOverview').textContent=portraitOverview?'Follow me':'Full map';updatePortraitCamera();});
  $('touchInteract').addEventListener('click',()=>{clearHeldDirections();interact();});
  window.addEventListener('resize',updatePortraitCamera);
  function drawWorld(){
    if(state.screen!=='gameScreen')return;
    updatePortraitCamera();
    const scene=chapter().scene,art=ART.imgs[scene];
    if(art){drawArt(art);drawMaterialSurfaces(scene)}
    else if(scene==='home')drawHome();else if(scene==='route')drawRoute();else if(scene==='atrium')drawAtrium();else if(scene==='classroom')drawClassroom();else drawLunch();
    routeActors=[];drawAmbientRoute(performance.now());
    drawExitDoor(scene);
    const events=chapter().events.slice().sort((a,b)=>a.y-b.y),showEvents=!(state.chapter===0&&(state.homeIntro==='sleeping'||state.homeIntro==='waking'));
    if(showEvents)events.filter(e=>e.y<state.player.y).forEach(drawMarker);
    const playerFootY=state.player.y*TILE+((ART.scenes[scene]?.groundOffset)??16),routeActor=routeActors[0];
    if(routeActor&&playerFootY<routeActor.footY){drawPlayer();routeActor.draw()}else{if(routeActor)routeActor.draw();drawPlayer()}
    drawAmbientThought(performance.now());
    if(showEvents)events.filter(e=>e.y>=state.player.y).forEach(drawMarker);
    if(ART.debug)drawDebugGrid();
  }

  function drawExitDoor(scene){
    const exit=scene.exit;if(!exit)return;
    const x=Math.round(exit.x*TILE),y=Math.round(exit.y*TILE),ready=completedCount()>=chapter().required&&state.homeIntro==='ready';
    ctx.save();ctx.strokeStyle=ready?'#f5ce68':'#7c5835';ctx.lineWidth=4;ctx.strokeRect(x-19,y-40,38,42);ctx.fillStyle=ready?'rgba(255,222,132,.16)':'rgba(58,36,21,.13)';ctx.fillRect(x-16,y-37,32,38);
    ctx.fillStyle='#3a2415';ctx.fillRect(x-8,y-5,3,3);ctx.fillStyle=ready?'#fff0c8':'#f1dfbd';ctx.font="bold 12px 'Pixelify Sans',monospace";ctx.textAlign='center';ctx.fillText(state.language==='zh'?'出门':'EXIT',x,y-46);ctx.restore();
  }

  function updateHomeControls(){
    const home=state.chapter===0,zh=state.language==='zh';
    $('wakeButton').classList.toggle('hidden',!home||state.homeIntro==='ready');
    $('wakeButton').textContent=state.homeIntro==='waking'?(zh?'跳过起床':'Skip wake-up'):(zh?'起床':'Wake up');
    $('pickupButton').textContent=state.carrying?(zh?'放下笔记本  H':'Put notebook down  H'):(zh?'拿起笔记本  H':'Pick up notebook  H');
    $('examineButton').textContent=zh?'查看课表  R':'Check timetable  R';$('waveActionButton').textContent=zh?'挥手  F':'Wave  F';$('restButton').textContent=state.resting?(zh?'站起来  P':'Stand up  P'):(zh?'休息一下  P':'Take a pause  P');
    $('doorButton').textContent=state.chapter===0?(zh?'出门 →':'Leave home →'):(state.chapter===chapters.length-1?(zh?'回家结束这一天 →':'Go home and end the day →'):(zh?'前往下一处 →':'Continue to next place →'));$('momentsHudButton').firstChild.textContent=zh?'时刻 ': 'Moments ';
    $('gameSettingsButton').textContent=zh?'设置':'Settings';$('gameAboutButton').textContent=zh?'关于':'About';$('pauseButton').textContent=zh?(state.paused?'继续':'暂停'):(state.paused?'Resume':'Pause');$('gameLanguageButton').textContent=zh?'EN':'中文';
    $('movementHelp').innerHTML=zh?'WASD / 方向键移动 · 靠近时自动出现情境提示 · <kbd>E</kbd> 查看回应':'Move with WASD / arrows · scene cues appear as you approach · <kbd>E</kbd> explore responses';
    canvas.setAttribute('aria-label',zh?'可探索的校园情境地图。使用方向键或 WASD 移动；靠近时会自动出现情境提示。按 E 查看回应选项，也可从“时刻”菜单打开。':'Explorable campus scene. Move with arrow keys or WASD; scene cues appear automatically as you approach. Press E to explore responses, or open Moments from the menu.');
    $('taskDrawer').setAttribute('aria-label',zh?'本章时刻':'Chapter moments');$('portraitModePrompt').querySelector('strong').textContent=zh?'请将设备横过来':'Please turn your device sideways';$('portraitModePrompt').querySelector('p').textContent=zh?'游戏为横屏体验设计。':'This game is designed for landscape play.';
    const sleeping=home&&state.homeIntro!=='ready';['pickupButton','examineButton','waveActionButton','restButton'].forEach(id=>$(id).classList.toggle('hidden',sleeping));
  }
  function pointInPolygon(x,y,points){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j],crosses=(yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi||1e-9)+xi;if(crosses)inside=!inside}return inside}
  function isWalkable(sceneKey,x,y,bounds){if(x<bounds.x0||x>bounds.x1||y<bounds.y0||y>bounds.y1)return false;const scene=ART.scenes[sceneKey],zones=scene?.walkableZones;if(zones?.length&&!zones.some(z=>z.points?.length?pointInPolygon(x,y,z.points):x>=z.x0&&x<=z.x1&&y>=z.y0&&y<=z.y1))return false;const blockers=scene?.blockedZones||[];return !blockers.some(z=>z.points?.length?pointInPolygon(x,y,z.points):x>=z.x0&&x<=z.x1&&y>=z.y0&&y<=z.y1)}
  function move(dx,dy,speed=1){if(state.screen!=='gameScreen'||state.homeIntro!=='ready'||state.paused||performance.now()<state.actionUntil||!$('eventOverlay').classList.contains('hidden')||!$('infoOverlay').classList.contains('hidden'))return;state.resting=false;state.characterReaction=null;const sceneKey=chapter().scene,b=ART.bounds[sceneKey]||{x0:1,x1:28,y0:3,y1:16};if(Math.abs(dx)>Math.abs(dy))state.facing=dx<0?'left':'right';else if(dy)state.facing=dy<0?'up':'down';state.lastMove=performance.now();const currentX=state.player.x,currentY=state.player.y,nextX=Math.max(b.x0,Math.min(b.x1,currentX+dx*speed)),nextY=Math.max(b.y0,Math.min(b.y1,currentY+dy*speed));let x=currentX,y=currentY;if(isWalkable(sceneKey,nextX,y,b))x=nextX;if(isWalkable(sceneKey,x,nextY,b))y=nextY;if(sceneKey==='atrium'&&dy!==0&&(x===currentX&&y===currentY)&&((currentY>7.5&&nextY<=8.5&&currentX<22.2)||(currentY<=7.5&&nextY>7.5&&currentX<22.2))){const now=performance.now();if(now-(state.lastBlockedToast||0)>1800){showToast(state.language==='zh'?'请走右侧扶梯前往二楼':'Use the right-hand escalator to reach the upper gallery');state.lastBlockedToast=now}}state.player.x=x;state.player.y=y;}
  function actionAllowed(){return state.screen==='gameScreen'&&state.homeIntro==='ready'&&!state.paused&&performance.now()>=state.actionUntil&&$('eventOverlay').classList.contains('hidden')&&$('infoOverlay').classList.contains('hidden')}
  function timedAction(name,duration=620,onDone=null){if(!actionAllowed())return;state.actionName=name;state.actionUntil=performance.now()+duration;drawWorld();window.setTimeout(()=>{if(performance.now()>=state.actionUntil){state.actionName='';state.actionUntil=0;if(onDone)onDone();drawWorld()}},duration+20)}
  function toggleCarry(){if(!actionAllowed())return;timedAction('pickup',480,()=>{state.carrying=!state.carrying;updateHomeControls();$('poseStatus').textContent=state.language==='zh'?(state.carrying?'拿着笔记本':'空着手'):(state.carrying?'Holding a notebook':'Hands free');showToast(state.carrying?(state.language==='zh'?'拿起了笔记本':'Picked up the notebook'):(state.language==='zh'?'放下了笔记本':'Put the notebook down'))})}
  function checkTimetable(){if(!actionAllowed())return;timedAction('examine',700,()=>showToast(state.language==='zh'?'查看了课表':'Checked the timetable'))}
  function toggleRest(){if(!actionAllowed())return;state.resting=!state.resting;updateHomeControls();$('poseStatus').textContent=state.resting?(state.language==='zh'?'正在休息':'Taking a pause'):(state.language==='zh'?'已结束休息':'Back on your feet');drawWorld()}
  function waveHello(){if(!actionAllowed())return;state.waveUntil=performance.now()+1200;timedAction('wave',1200,()=>{state.waveUntil=0;showToast(state.language==='zh'?'挥手打招呼':'Waved hello')})}
  function showToast(message){$('gameToast').textContent=message;$('gameToast').classList.add('visible');window.clearTimeout(state.toastTimer);state.toastTimer=window.setTimeout(()=>$('gameToast').classList.remove('visible'),1800)}
  function completeWake(){state.homeIntro='ready';state.wakePhase='';state.actionName='';state.actionUntil=0;state.player={...chapter().start};state.lastMove=0;updateHomeControls();renderTasks();drawWorld();showToast(state.language==='zh'?'准备好出发了':'You are ready to get going')}
  function triggerWake(){if(state.homeIntro==='waking'){completeWake();return}if(state.homeIntro!=='sleeping')return;state.homeIntro='waking';state.wakePhase='sit';updateHomeControls();drawWorld();if(REDUCED){completeWake();return}window.setTimeout(()=>{if(state.homeIntro!=='waking')return;state.wakePhase='stand';drawWorld();window.setTimeout(()=>{if(state.homeIntro==='waking')completeWake()},580)},600)}
  function startEventAction(e,trigger=null){if(!e)return;if(REDUCED||!e.action||state.done[eventKey(e)]){openEvent(e,trigger);return}state.actionName=e.action;state.actionUntil=performance.now()+500;const token=state.actionToken=Date.now();drawWorld();window.setTimeout(()=>{if(state.actionToken!==token)return;state.actionName='';state.actionUntil=0;openEvent(e,trigger)},520)}
  function nearestEvent(){return chapter().events.map(e=>({e,d:distance(e,state.player)})).sort((a,b)=>a.d-b.d)[0]}
  function openDogInteraction(trigger=null){if(chapter().scene!=='route'||state.paused||!Number.isFinite(routeAmbient.dogX))return false;const dogDistance=Math.hypot(state.player.x-routeAmbient.dogX/TILE,state.player.y-(routeAmbient.dogY-16)/TILE);if(dogDistance>=4.8)return false;const dogEvent=chapter().events.find(e=>e.id==='park');if(!dogEvent)return false;startEventAction(dogEvent,trigger||document.activeElement);return true}
  function interact(){if(state.screen!=='gameScreen')return;if(state.homeIntro==='sleeping'||state.homeIntro==='waking'){triggerWake();return}const exit=ART.scenes[chapter().scene]?.exit;if(state.chapter===0&&exit&&completedCount()>=chapter().required&&distance(exit,state.player)<2.2){nextChapter();return}if(state.proximityCue){startEventAction(state.proximityCue.event,document.activeElement);return}if(openDogInteraction(document.activeElement))return;const n=nearestEvent();if(n&&n.d<3.1)startEventAction(n.e,document.activeElement);else showToast(state.language==='zh'?'靠近标记，或从“时刻”菜单选择。':'Move closer to a marker, or choose it from Moments.')}
  canvas.addEventListener('pointerdown',ev=>{if(state.screen!=='gameScreen'||chapter().scene!=='route'||state.paused||!$('eventOverlay').classList.contains('hidden'))return;const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*canvas.width/r.width,y=(ev.clientY-r.top)*canvas.height/r.height;if(Number.isFinite(routeAmbient.dogX)&&Math.hypot(x-routeAmbient.dogX,y-routeAmbient.dogY)<48){ev.preventDefault();openDogInteraction(canvas)}});
  function frame(t){
    const keys=new Set([...state.keys,...state.touchKeys]),moving=keys.size>0;
    if(state.screen==='gameScreen'&&!state.paused&&state.homeIntro==='ready'&&moving&&!state.event&&$('infoOverlay').classList.contains('hidden')){
      const dt=Math.min((t-state.lastFrame)||16,35)/16;let dx=0,dy=0;
      if(keys.has('arrowleft')||keys.has('a'))dx--;if(keys.has('arrowright')||keys.has('d'))dx++;
      if(keys.has('arrowup')||keys.has('w'))dy--;if(keys.has('arrowdown')||keys.has('s'))dy++;
      if(dx||dy){const len=Math.hypot(dx,dy);move(dx/len,dy/len,.08*dt)}
    }
    if(state.screen==='gameScreen'){updateProximityCue();syncAmbientAudio()}state.lastFrame=t;
    const drawerOpen=!$('taskDrawer').classList.contains('hidden'),menuOpen=!$('gameMenuPanel').classList.contains('hidden');
    const renderable=state.screen==='gameScreen'&&!document.hidden&&!state.paused&&$('eventOverlay').classList.contains('hidden')&&$('infoOverlay').classList.contains('hidden')&&!drawerOpen&&!menuOpen;
    const routeAnimation=chapter().scene==='route'&&!REDUCED&&!state.settings.reduceMotion;
    const cueAnimation=!!state.proximityCue&&!REDUCED&&!state.settings.reduceMotion&&t-state.proximityCue.createdAt<1800;
    const transientAnimation=state.homeIntro==='waking'||t<state.actionUntil||t<state.waveUntil;
    if(renderable&&(moving||routeAnimation||cueAnimation||transientAnimation)&&t-(state.lastDraw||0)>=33){state.lastDraw=t;drawWorld()}
    requestAnimationFrame(frame)
  }

  function renderPosts(){
    const defaults=[{topic:'Routes and information',body:'Fictional example: A preview of a room and a clear landmark would help me decide how to arrive.'},{topic:'How to respond',body:'Fictional example: Asking what information someone wants can be more useful than guessing.'},{topic:'What the game missed',body:'Fictional example: A different student may find this scene easy and another part of the day difficult.'}];
    $('postList').innerHTML=[...state.localPosts,...defaults].map(p=>`<article class="post"><small>${escapeHTML(p.topic)} · ${p.local?'LOCAL PREVIEW':'FICTIONAL EXAMPLE'}</small><h3>${p.local?'Your local reflection':'A discussion starting point'}</h3><p>${escapeHTML(p.body)}</p></article>`).join('');
  }

  function openInfo(kind){
    const zh=state.language==='zh';
    clearHeldDirections();
    state.infoTrigger=document.activeElement;
    $('infoTitle').textContent=kind==='settings'?(zh?'体验设置':'Experience settings'):kind==='card'?(zh?'我的偏好卡':'My preference card'):kind==='meters'?(zh?'故事状态':'Story status'):(zh?'关于这个项目':'About this project');
    if(kind==='settings'){
      $('infoContent').innerHTML=`<p>${zh?'调整呈现方式，不会改变故事或人物身份。':'Adjust the presentation without changing the story or the character’s identity.'}</p><label><input type="checkbox" id="largeTextToggle" ${state.settings.largeText?'checked':''}> ${zh?'放大文字':'Larger text'}</label><label><input type="checkbox" id="hideMetersToggle" ${state.settings.hideMeters?'checked':''}> ${zh?'隐藏角落状态提示':'Hide corner status cues'}</label><label><input type="checkbox" id="lowDetailToggle" ${state.settings.lowDetail?'checked':''}> ${zh?'减少画面细节':'Reduce colour detail'}</label><label><input type="checkbox" id="reduceMotionToggle" ${state.settings.reduceMotion?'checked':''}> ${zh?'减少环境动画':'Reduce environmental motion'}</label><label><input type="checkbox" id="ambientSoundToggle" ${state.settings.ambientSound?'checked':''}> ${zh?'启用可选环境音（默认关闭）':'Optional environmental sound (off by default)'}</label><p>${zh?'环境音包含远处交通/施工低鸣和两声短狗叫；默认关闭，可随时关闭。':'Optional sound adds a distant traffic/works rumble and two short dog-bark bursts. It is off by default and can be switched off at any time.'}</p>`;
    }else if(kind==='meters'){
      $('infoContent').innerHTML=$('meterPanel').innerHTML;
    }else if(kind==='card'){
      $('infoContent').innerHTML=`<p>${zh?'只写你愿意分享的内容。不必提供诊断或解释，偏好本身就有帮助。':'Write only what you choose to share. A preference can be useful without a diagnosis or explanation.'}</p><label for="cardText">${zh?'一件能帮助我的事':'One thing that would help me'}</label><textarea id="cardText" rows="4" placeholder="${zh?'例如：如果教室变更，请发文字通知。':'For example: Please send the room change in writing.'}"></textarea><button id="copyCard" class="secondary-button" type="button">${zh?'复制我的文字':'Copy my words'}</button><p id="cardStatus" class="fine-print">${zh?'内容不会自动分享，只保留在当前页面，刷新后清除。':'Nothing is shared automatically. This text stays on this page and disappears on refresh.'}</p>`;
      $('cardText').value=state.cardText;
      $('cardText').addEventListener('input',ev=>state.cardText=ev.target.value);
      $('copyCard').addEventListener('click',async()=>{
        if(!state.cardText.trim()){$('cardText').focus();return}
        try{await navigator.clipboard.writeText(state.cardText);$('cardStatus').textContent='Copied. You decide whether and where to share it.'}
        catch{$('cardText').select();$('cardStatus').textContent='Select and copy this text manually. Nothing was shared.'}
      });
    }else{
      const materialCards=materialSamples.map(s=>`<figure><img src="${s.src}" alt="${escapeHTML(zh?s.labelZh:s.label)}" loading="lazy" width="128" height="128"><figcaption><strong>${escapeHTML(zh?s.labelZh:s.label)}</strong><small>${escapeHTML(zh?s.placeZh:s.place)}</small></figcaption></figure>`).join('');
      $('infoContent').innerHTML=zh?`<p><strong>Team 6 · Design Innovation 2026。</strong>这是一个用校园日常情境探索信息、交流与选择的学生概念原型。</p><ul><li>Mei 和 Sam 是团队的人物草稿；Leila 是仍待验证的暂定人物。</li><li>对话、路线情况和支持回应需要与自闭症学生及校园工作人员共同审阅。</li><li>地图不提供实时路线、教室无障碍信息或安静空间的实时情况。</li><li>模拟体验不能代替倾听亲身经历，也不能代替改变现实中的障碍。</li></ul><details class="material-samples"><summary>查看 16 张材质样本</summary><p>这些独立贴图用于展示和后续设计参考。完整场景图已经包含材质与透视，因此没有把平面贴图硬盖在地图上；它们也不表示 UCL East 实际使用这些材质。</p><div class="material-sample-grid">${materialCards}</div></details>`:`<p><strong>Team 6 · Design Innovation 2026.</strong> A student concept exploring communication, information and choice in an illustrative UCL East day.</p><ul><li>Mei and Sam are draft personas from the team’s working material. Leila is a provisional design character.</li><li>Dialogue, route conditions and support responses need review with autistic students and campus staff.</li><li>This map does not provide live routes, room access or quiet-space availability.</li><li>Playing a simulation cannot replace listening to lived experience or changing real barriers.</li></ul><details class="material-samples"><summary>View all 16 material samples</summary><p>These separate swatches are a reference set for display and future design work. The finished scene illustrations already contain their materials and perspective, so flat swatches are not painted over the maps. They are not claims about the actual UCL East finishes.</p><div class="material-sample-grid">${materialCards}</div></details>`;
    }
    $('app').inert=true;
    $('infoOverlay').classList.remove('hidden');$('infoOverlay').setAttribute('aria-hidden','false');
    if(kind==='settings'){
      [['largeTextToggle','largeText','large-text'],['hideMetersToggle','hideMeters','hide-meters'],['lowDetailToggle','lowDetail','low-detail'],['reduceMotionToggle','reduceMotion',null],['ambientSoundToggle','ambientSound',null]].forEach(([id,key,cls])=>$(id).addEventListener('change',ev=>{state.settings[key]=ev.target.checked;if(cls)document.body.classList.toggle(cls,ev.target.checked);if(key==='hideMeters')renderMeters();if(key==='reduceMotion')drawWorld();if(key==='ambientSound'){if(ev.target.checked)ensureAmbientAudio();syncAmbientAudio()}}));
    }
    $('closeInfo').focus();
  }
  function closeInfo(){const trigger=state.infoTrigger;state.infoTrigger=null;$('infoOverlay').classList.add('hidden');$('infoOverlay').setAttribute('aria-hidden','true');$('app').inert=false;if(trigger?.isConnected&&trigger.focus)trigger.focus();drawWorld()}

  function clearHeldDirections(){state.keys.clear();state.touchKeys.clear();document.querySelectorAll('[data-dir].is-held').forEach(el=>el.classList.remove('is-held'))}
  function toggleDrawer(force){const drawer=$('taskDrawer'),open=force??drawer.classList.contains('hidden');clearHeldDirections();drawer.classList.toggle('hidden',!open);$('momentsHudButton').setAttribute('aria-expanded',String(open));if(open){$('gameMenuPanel').classList.add('hidden');$('gameMenuButton').setAttribute('aria-expanded','false');$('closeTaskDrawer').focus()}else $('momentsHudButton').focus();drawWorld()}
  function toggleGameMenu(force){const menu=$('gameMenuPanel'),open=force??menu.classList.contains('hidden');if(open)clearHeldDirections();menu.classList.toggle('hidden',!open);$('gameMenuButton').setAttribute('aria-expanded',String(open));if(open){$('taskDrawer').classList.add('hidden');$('momentsHudButton').setAttribute('aria-expanded','false');$('gameSettingsButton').focus()}else $('gameMenuButton').focus();drawWorld()}
  function togglePause(){state.paused=!state.paused;clearHeldDirections();$('gamePauseOverlay').classList.toggle('hidden',!state.paused);$('pauseTitle').textContent=state.language==='zh'?'已暂停':'Paused';$('resumeButton').textContent=state.language==='zh'?'继续':'Resume';$('pauseButton').textContent=state.language==='zh'?(state.paused?'继续':'暂停'):(state.paused?'Resume':'Pause');if(state.paused){$('gamePauseOverlay').setAttribute('aria-hidden','false');$('resumeButton').focus()}else{$('gamePauseOverlay').setAttribute('aria-hidden','true');$('pauseButton').focus()}drawWorld()}
  function trapDialogTab(ev){const overlay=!$('eventOverlay').classList.contains('hidden')?$('eventOverlay'):!$('infoOverlay').classList.contains('hidden')?$('infoOverlay'):null;if(!overlay||ev.key!=='Tab')return false;const nodes=[...overlay.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);if(!nodes.length)return true;const first=nodes[0],last=nodes[nodes.length-1];if(ev.shiftKey&&document.activeElement===first){last.focus();ev.preventDefault()}else if(!ev.shiftKey&&document.activeElement===last){first.focus();ev.preventDefault()}return true}

  $('startButton').addEventListener('click',()=>{showScreen('characterScreen');renderCharacters()});
  $('languageEnglish').addEventListener('click',()=>setWelcomeLanguage('en'));
  $('languageChinese').addEventListener('click',()=>setWelcomeLanguage('zh'));
  $('backToWelcome').addEventListener('click',()=>showScreen('welcomeScreen'));
  $('beginGame').addEventListener('click',startGame);
  $('hairSelect').addEventListener('change',ev=>{state.hair=ev.target.value;renderCharacters()});
  $('outfitSelect').addEventListener('change',ev=>{state.outfit=ev.target.value;renderCharacters()});
  $('closeDialog').addEventListener('click',closeEvent);
  $('proximityRespondButton').addEventListener('click',ev=>{const cue=state.proximityCue;if(cue)startEventAction(cue.event,ev.currentTarget)});
  $('proximityDismissButton').addEventListener('click',dismissProximityCue);
  $('eventOverlay').addEventListener('click',ev=>{if(ev.target===$('eventOverlay'))closeEvent()});
  $('settingsButton').addEventListener('click',()=>openInfo('settings'));
  $('preferenceCardButton').addEventListener('click',()=>openInfo('card'));
  $('aboutButton').addEventListener('click',()=>openInfo('about'));
  $('closeInfo').addEventListener('click',closeInfo);
  $('infoOverlay').addEventListener('click',ev=>{if(ev.target===$('infoOverlay'))closeInfo()});
  $('reflectionButton').addEventListener('click',()=>{renderBodyStateGallery();showScreen('reflectionScreen')});
  $('replayButton').addEventListener('click',()=>{showScreen('characterScreen');renderCharacters()});
  $('communityButton').addEventListener('click',()=>{renderPosts();showScreen('communityScreen')});
  $('finishButton').addEventListener('click',()=>showScreen('welcomeScreen'));
  $('restartButton').addEventListener('click',()=>{showScreen('characterScreen');renderCharacters()});
  $('backToReflection').addEventListener('click',()=>showScreen('reflectionScreen'));
  $('addPostButton').addEventListener('click',()=>{const body=$('postBody').value.trim();if(!body){$('postBody').focus();return}state.localPosts.unshift({topic:$('postTopic').value,body,local:true});$('postBody').value='';renderPosts()});
  $('wakeButton').addEventListener('click',triggerWake);
  $('pickupButton').addEventListener('click',toggleCarry);
  $('examineButton').addEventListener('click',checkTimetable);
  $('waveActionButton').addEventListener('click',waveHello);
  $('restButton').addEventListener('click',toggleRest);
  $('doorButton').addEventListener('click',nextChapter);
  $('nextChapterButton').addEventListener('click',nextChapter);
  $('momentsHudButton').addEventListener('click',()=>toggleDrawer());
  $('closeTaskDrawer').addEventListener('click',()=>toggleDrawer(false));
  $('gameMenuButton').addEventListener('click',()=>toggleGameMenu());
  $('gameSettingsButton').addEventListener('click',()=>{toggleGameMenu(false);openInfo('settings')});
  $('gameAboutButton').addEventListener('click',()=>{toggleGameMenu(false);openInfo('about')});
  $('gameLanguageButton').addEventListener('click',()=>{toggleGameMenu(false);setWelcomeLanguage(state.language==='zh'?'en':'zh')});
  $('pauseButton').addEventListener('click',()=>{toggleGameMenu(false);togglePause()});
  $('resumeButton').addEventListener('click',togglePause);
  ['hudEnergy','hudFocus','hudLoad'].forEach(id=>$(id).addEventListener('click',()=>openInfo('meters')));
  canvas.addEventListener('click',ev=>{
    if(state.screen!=='gameScreen'||state.homeIntro!=='ready'||state.paused||!$('eventOverlay').classList.contains('hidden'))return;
    canvas.focus();
    const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*canvas.width/r.width/TILE,y=(ev.clientY-r.top)*canvas.height/r.height/TILE;
    if(ART.debug){const pos=chapter().scene+' x:'+x.toFixed(1)+', y:'+y.toFixed(1);console.log(pos);$('currentCharacterFooter').textContent='Calibration '+pos;return}
    const c=localizedChapter(),n=c.events.map(e=>({e,d:Math.hypot(e.x-x,e.y-y)})).sort((a,b)=>a.d-b.d)[0];
    if(n&&n.d<2.4)startEventAction(n.e,canvas);
  });
  document.addEventListener('keydown',ev=>{
    if(ev.key==='Escape'){
      if(!$('eventOverlay').classList.contains('hidden'))closeEvent();
      else if(!$('infoOverlay').classList.contains('hidden'))closeInfo();
      else if(!$('gameMenuPanel').classList.contains('hidden'))toggleGameMenu(false);
      else if(!$('taskDrawer').classList.contains('hidden'))toggleDrawer(false);
      else if(state.paused)togglePause();
      return;
    }
    if(trapDialogTab(ev))return;
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
    if(state.screen!=='gameScreen'||(document.activeElement!==canvas&&!document.activeElement?.matches('[data-dir]')))return;
    const key=ev.key.toLowerCase();
    if(!ev.repeat&&key==='h'){toggleCarry();ev.preventDefault();return}
    if(!ev.repeat&&key==='f'){waveHello();ev.preventDefault();return}
    if(!ev.repeat&&key==='r'){checkTimetable();ev.preventDefault();return}
    if(!ev.repeat&&key==='p'){toggleRest();ev.preventDefault();return}
    if(['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d'].includes(key)){
      state.keys.add(key);if(key.startsWith('arrow'))ev.preventDefault();
    }
    if(!ev.repeat&&key==='e'){interact();ev.preventDefault()}
  });
  document.addEventListener('keyup',ev=>state.keys.delete(ev.key.toLowerCase()));
  window.addEventListener('blur',clearHeldDirections);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearHeldDirections();else if(state.screen==='gameScreen')drawWorld()});
  const touchDirectionKeys={left:'arrowleft',right:'arrowright',up:'arrowup',down:'arrowdown'};
  document.querySelectorAll('[data-dir]').forEach(el=>{
    const key=touchDirectionKeys[el.dataset.dir];el.style.touchAction='none';el._activePointers=new Set();
    el.addEventListener('pointerdown',ev=>{if(ev.button!==undefined&&ev.button!==0)return;ev.preventDefault();el._activePointers.add(ev.pointerId);state.touchKeys.add(key);el.classList.add('is-held');try{el.setPointerCapture(ev.pointerId)}catch{}});
    const release=ev=>{el._activePointers.delete(ev.pointerId);if(!el._activePointers.size){state.touchKeys.delete(key);el.classList.remove('is-held')}};
    el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
    el.addEventListener('click',ev=>{if(ev.detail===0){const d={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[el.dataset.dir];move(...d,.8)}});
  });
  function validateBranchSpecs(){
    const errors=[],types=new Set(Object.values(interactionTypes).flat()),actionIds=new Set(['lying','wakeEyes','wakeSit','wakeStand','pickup','examine','look','notebook','wave','rest','chair','phone','laptop']);
    let mechanismCount=0,localeCount=0,existingActionCount=0;const englishResults=[],englishPrompts=[],chineseResults=[],chinesePrompts=[];
    const repeatedChoiceActions=Object.entries(postActions).filter(([,actions])=>new Set(actions).size!==actions.length).map(([event])=>event);
    const repeatedChoiceMechanics=Object.entries(interactionTypes).filter(([,mechanics])=>new Set(mechanics).size!==mechanics.length).map(([event])=>event);
    if(repeatedChoiceActions.length)errors.push(`choice actions are not distinct at: ${repeatedChoiceActions.join(', ')}`);
    if(repeatedChoiceMechanics.length)errors.push(`interaction mechanics are not distinct at: ${repeatedChoiceMechanics.join(', ')}`);
    characters.forEach(person=>chapters.flatMap(ch=>ch.events).forEach(event=>event.choices.forEach((_,index)=>{
      mechanismCount++;const locales=branchSpec[person.id]?.[event.id]?.[index];if(!locales){errors.push(`missing ${person.id}/${event.id}/${index}`);return}
      ['en','zh'].forEach(language=>{
        localeCount++;const spec=locales[language];if(!spec){errors.push(`missing locale ${person.id}/${event.id}/${index}/${language}`);return}
        if(!spec.result?.text?.trim())errors.push(`empty result ${person.id}/${event.id}/${index}/${language}`);
        if(!spec.action?.post||!actionIds.has(spec.action.post))errors.push(`unknown action ${person.id}/${event.id}/${index}/${language}`);
        if(spec.action?.asset!=='existing'&&spec.action?.asset!=='pending')errors.push(`missing asset status ${person.id}/${event.id}/${index}/${language}`);
        if(spec.action?.asset==='existing')existingActionCount++;
        if(!types.has(spec.interaction?.type)||spec.interaction.steps.length<1||spec.interaction.steps.length>3)errors.push(`invalid interaction ${person.id}/${event.id}/${index}/${language}`);
        if(!spec.interaction.steps[0]?.options?.length||!spec.interaction.defaultOnSkip)errors.push(`missing options/default ${person.id}/${event.id}/${index}/${language}`);
        if(['reception','group','support'].includes(event.id)&&!spec.responder?.text)errors.push(`missing responder ${person.id}/${event.id}/${index}/${language}`);
        if(!spec.setFlags?.length||!spec.downstream?.length||!spec.ending?.note)errors.push(`missing flag/downstream/ending ${person.id}/${event.id}/${index}/${language}`);
        if(language==='en'){englishResults.push(spec.result.text);englishPrompts.push(spec.interaction.steps.map(step=>step.prompt).join('|'))}
        else {chineseResults.push(spec.result.text);chinesePrompts.push(spec.interaction.steps.map(step=>step.prompt).join('|'))}
      });
      const en=locales.en,zh=locales.zh;if(en&&zh){
        if(en.action.post!==zh.action.post||en.interaction.type!==zh.interaction.type||JSON.stringify(en.setFlags)!==JSON.stringify(zh.setFlags))errors.push(`locale mechanics mismatch ${person.id}/${event.id}/${index}`);
      }
    })));
    if(mechanismCount!==135)errors.push(`expected 135 mechanisms, got ${mechanismCount}`);
    if(localeCount!==270)errors.push(`expected 270 localized branches, got ${localeCount}`);
    if(new Set(englishResults).size!==135)errors.push(`English result copy is not unique across the 135 persona/event/choice branches (${new Set(englishResults).size})`);
    if(new Set(englishPrompts).size!==135)errors.push(`English interaction prompts are not unique across the 135 persona/event/choice branches (${new Set(englishPrompts).size})`);
    if(new Set(chineseResults).size!==135)errors.push(`Chinese result copy is not unique across the 135 persona/event/choice branches (${new Set(chineseResults).size})`);
    if(new Set(chinesePrompts).size!==135)errors.push(`Chinese interaction prompts are not unique across the 135 persona/event/choice branches (${new Set(chinesePrompts).size})`);
    const flags=Object.values(branchFlags).flat(),unlinked=flags.filter(flag=>!flagLabels[flag]);if(unlinked.length)errors.push(`flags without labels: ${unlinked.join(', ')}`);
    const reactions=Object.values(reactionTriggers).flatMap(events=>Object.entries(events).flatMap(([event,options])=>Object.keys(options).map(option=>({event,option}))));
    if(reactions.length!==13)errors.push(`expected 13 legacy reaction mappings to review, got ${reactions.length}`);
    return {mechanismCount,localeCount,existingActionCount,uniqueEnglishResults:new Set(englishResults).size,uniqueEnglishPrompts:new Set(englishPrompts).size,uniqueChineseResults:new Set(chineseResults).size,uniqueChinesePrompts:new Set(chinesePrompts).size,choiceEventsWithDistinctActions:Object.keys(postActions).length-repeatedChoiceActions.length,choiceEventsWithDistinctInteractionTypes:Object.keys(interactionTypes).length-repeatedChoiceMechanics.length,flagCount:new Set(flags).size,reactionMappingsForReview:reactions.length,errors};
  }
  if(/[?&]test=1(?:&|$)/.test(location.search)){
    const snapshot=value=>JSON.parse(JSON.stringify(value));
    Object.defineProperty(window,'__TEAM6_TEST__',{configurable:true,value:Object.freeze({
      get branchSpec(){return snapshot(branchSpec)},get validation(){return validateBranchSpecs()},get flags(){return snapshot(deriveFlags())},
      get auditSources(){
        const reactionRows=Object.entries(reactionTriggers).flatMap(([person,events])=>Object.entries(events).flatMap(([event,options])=>Object.entries(options).map(([choice,reaction])=>({person,event,choice:Number(choice),reaction,reviewRequired:true,autoApplied:false}))));
        const replyRows=Object.entries(personaReplies).flatMap(([language,people])=>Object.entries(people).flatMap(([person,events])=>Object.entries(events).flatMap(([event,options])=>Object.entries(options).map(([choice,text])=>({language,person,event,choice:Number(choice),text})))));
        const responseRows=Object.entries(responderResponses).flatMap(([language,events])=>Object.entries(events).flatMap(([event,options])=>options.map((text,choice)=>({language,event,choice,text}))));
        return snapshot({reactions:reactionRows,personaReplies:replyRows,responderResponses:responseRows});
      },
      get actionLog(){return snapshot(state.actionLog)},get interactionLog(){return snapshot(state.interactionLog)},get reaction(){return state.characterReaction},
      get endingText(){return $('daySummary')?.innerText||''},get currentResultText(){const e=state.event,record=e&&state.done[eventKey(e)];return e&&record&&!isStaleRecord(e.id,record)?eventSpec(e,record.choiceIndex)?.result.text||'':''},
      get currentCharacter(){return state.character},get currentLanguage(){return state.language},get completed(){return state.journal.length}
    })});
  }
  if(ART.debug)Object.defineProperty(window,'__team6Debug',{configurable:true,get(){const scene=chapter().scene,b=ART.bounds[scene]||{x0:1,x1:28,y0:3,y1:16};return ART.debug?{scene,chapter:chapter().id,player:{...state.player},doneKeys:Object.keys(state.done),walkable:isWalkable(scene,state.player.x,state.player.y,b),walkableAt:(x,y)=>isWalkable(scene,x,y,b),bounds:b}:null}});
  loadArt();
  requestAnimationFrame(frame);
})();
