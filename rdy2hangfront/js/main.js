$('.toggle').toggles({
    drag: true, // can the toggle be dragged
    click: true, // can it be clicked to toggle
    text: {
      on: 'YES', // text for the ON position
      off: 'NO' // and off
    },
    on: false, // is the toggle ON on init
    animate: 250, // animation time
    transition: 'ease-in-out', // animation transition,
    checkbox: null, // the checkbox to toggle (for use in forms)
    clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
    width: 400, // width used if not set in css
    height: 50, // height if not set in css
    type: 'compact' // if this is set to 'select' then the select style toggle will be used
  });
