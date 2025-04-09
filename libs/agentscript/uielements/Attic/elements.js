const json = [
  {
    "command": "reset()",
    "id": 1728927569824,
    "name": "reset",
    "position": {
      "x": 94,
      "y": 35
    },
    "type": "button"
  },
  {
    "command": "anim.setFps(value)",
    "id": 1728682054456,
    "max": "60",
    "min": "0",
    "name": "fps",
    "position": {
      "x": 165,
      "y": 35
    },
    "step": "1",
    "type": "range",
    "value": "30"
  },
  {
    "id": 1729270887157,
    "type": "output",
    "name": "ticks",
    "position": {
      "x": 331,
      "y": 33
    },
    "monitor": "model.ticks",
    "fps": "10"
  },
  {
    "id": 1730215309523,
    "type": "checkbox",
    "name": "run",
    "command": "checked ? anim.start() : anim.stop()",
    "position": {
      "x": 25,
      "y": 37
    },
    "checked": false
  },
  {
    "id": 1730223001632,
    "type": "dropdown",
    "name": "shaape",
    "command": "view.drawOptions.turtlesShape = value",
    "position": {
      "x": 147,
      "y": 131
    },
    "options": [
      "circle",
      "dart",
      "person",
      "bug"
    ],
    "selected": "bug"
  },
  {
    "id": 1730394519738,
    "type": "button",
    "name": "download",
    "command": "util.downloadJsonModule(json, 'elements.js')",
    "position": {
      "x": 19,
      "y": 133
    }
  }
]
export default json