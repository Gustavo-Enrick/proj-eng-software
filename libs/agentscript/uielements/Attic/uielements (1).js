// import * as util from 'https://code.agentscript.org/src/utils.js'
import * as util from '../src/utils.js'

// =================== initialization ===================
// loading links
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'uielements.css'
link.type = 'text/css'
document.head.appendChild(link)

// loading divs.html
// await fetch('./divs.html')
//     .then(response => response.text())
//     .then(html => {
//         // Insert after <body> tag starts
//         document.body.insertAdjacentHTML('afterbegin', html)
//         // console.log('fetch divs.html')
//     })
await fetch('./divs.html')
    .then(response => response.text())
    .then(html => {
        // Insert the divs.html content
        document.body.insertAdjacentHTML('afterbegin', html)
        console.log('divs.html loaded and parsed')

        // Attach the click handlers for the menu options globally

        document.getElementById('editOption').onclick = function (e) {
            e.stopPropagation() // Prevent event bubbling
            console.log('Edit option clicked') // Log for debugging
            const elementId = window.selectedElementId
            const jsonElement = window.ui.json.find(el => el.id == elementId)

            if (jsonElement) {
                showPopup(jsonElement.type, jsonElement) // Show the form for editing
            }
            document.getElementById('popupMenu').style.display = 'none' // Hide the popup menu
        }

        document.getElementById('deleteOption').onclick = function (e) {
            e.stopPropagation() // Prevent event bubbling
            console.log('Delete option clicked') // Log for debugging
            const elementId = window.selectedElementId
            const wrapper = document.querySelector(`[data-id="${elementId}"]`)
            if (wrapper) {
                wrapper.remove() // Remove the element from the UI
                window.ui.json = window.ui.json.filter(
                    el => el.id !== elementId
                ) // Remove from JSON array
                jsonToStorage() // Save the updated state
            }
            document.getElementById('popupMenu').style.display = 'none' // Hide the popup menu
        }

        document.getElementById('cancelOption').onclick = function (e) {
            e.stopPropagation() // Prevent event bubbling
            console.log('Cancel option clicked') // Log for debugging
            document.getElementById('popupMenu').style.display = 'none' // Hide the popup menu
        }

        // Temporarily disable the popup hiding when clicking outside
        // document.onclick = function (e) {
        //     const popupMenu = document.getElementById('popupMenu')
        //     if (!popupMenu.contains(e.target)) {
        //         popupMenu.style.display = 'none' // Hide the popup menu if clicking outside
        //     }
        // }
        // document.onclick = function (e) {
        //     const popupMenu = document.getElementById('popupMenu')
        //     // Check if the click was outside the popup menu
        //     if (
        //         !popupMenu.contains(e.target) &&
        //         popupMenu.style.display === 'block'
        //     ) {
        //         popupMenu.style.display = 'none' // Hide the popup menu
        //     }
        // }
    })

// Initialize the window.ui object if not already defined
window.ui = window.ui || {} // Ensure 'ui' exists
window.ui.json = [] // Initialize the json array

document.getElementById('uiContainer').addEventListener('contextmenu', e => {
    e.preventDefault()
})

// =================== create ui forms for popups ===================

let elementType = ''
let currentDragElement = null
let offsetX = 0
let offsetY = 0
let editingElementId = null // Global variable to track editing

// Show popup modal to create new elements
export function showPopup(type, jsonElement = {}) {
    elementType = type
    const formContainer = document.getElementById('formContainer')
    formContainer.innerHTML = '' // Clear previous form inputs

    // Default or existing values from jsonElement
    const name = jsonElement.name || ''
    const command = jsonElement.command || ''
    const min = jsonElement.min || 0
    const max = jsonElement.max || 100
    const step = jsonElement.step || 1
    const value = jsonElement.value || ''
    const selected = jsonElement.selected || ''

    let formContent = `
    <label for="name">Name:</label>
    <input type="text" id="elementName" value="${name}" required><br>
    `

    if (type !== 'output') {
        formContent += `
    <label for="command">Command:</label>
    <input type="text" id="elementCommand" value="${command}" required><br>
    `
    }

    // Handle specific element types
    let modelTitle = 'Button'
    if (type === 'checkbox') {
        modelTitle = 'Checkbox'
        formContent += `
    <label for="checked">Checked:</label>
    <input type="checkbox" id="elementChecked" ${
        jsonElement.checked ? 'checked' : ''
    }><br>
    `
    } else if (type === 'dropdown') {
        modelTitle = 'Dropdown'
        formContent += `
    <label for="values">Dropdown Options:</label>
    <input type="text" id="elementOptions" value="${
        jsonElement.options ? jsonElement.options.join(', ') : ''
    }" required><br>
    <label for="selected">Selected Value:</label>
    <input type="text" id="elementSelected" value="${selected}" required><br>
    `
    } else if (type === 'range') {
        modelTitle = 'Slider'
        formContent += `
    <label for="min">Min:</label>
    <input type="number" id="elementMin" value="${min}" required><br>
    <label for="max">Max:</label>
    <input type="number" id="elementMax" value="${max}" required><br>
    <label for="step">Step:</label>
    <input type="number" id="elementStep" value="${step}"><br>
    <label for="value">Current Value:</label>
    <input type="number" id="elementValue" value="${value}" required><br>
    `
    } else if (type === 'output') {
        modelTitle = 'Monitor'
        formContent += `
    <label for="monitor">Value/Function to Monitor:</label>
    <input type="text" id="elementMonitor" value="${
        jsonElement.monitor || ''
    }" required><br>
    <label for="fps">Frames per Second (FPS):</label>
    <input type="number" id="elementFps" value="${jsonElement.fps || 10}"><br>
    `
    }

    // document.getElementById('modal-header').innerText = 'Edit ' + type
    document.getElementById('modal-header').innerText = modelTitle
    formContainer.innerHTML = formContent
    document.getElementById('popupModal').style.display = 'flex'
}

// Cancel the popup
export function cancel() {
    document.getElementById('popupModal').style.display = 'none'
}

// =================== create a wrapper for a ui form ===================

function createElementWrapper(element, id) {
    const wrapper = document.createElement('div')
    wrapper.className = 'ui-element'
    wrapper.dataset.id = id // Store the id in the wrapper for reference

    // Set initial pixel-based position for the new element
    const containerRect = document
        .getElementById('uiContainer')
        .getBoundingClientRect()
    wrapper.style.left = containerRect.width / 2 - 50 + 'px' // Centered horizontally
    wrapper.style.top = containerRect.height / 2 - 25 + 'px' // Centered vertically

    wrapper.appendChild(element)

    // Make the element draggable
    wrapper.onmousedown = function (e) {
        if (e.ctrlKey && e.detail === 1) {
            dragMouseDown(e)
        } else if (e.shiftKey) {
            // Prevent normal click behavior
            e.preventDefault()

            const elementId = wrapper.dataset.id

            // Show the popup menu near the clicked element
            const popupMenu = document.getElementById('popupMenu')
            popupMenu.style.display = 'block'
            popupMenu.style.left = `${e.pageX}px`
            popupMenu.style.top = `${e.pageY}px`

            // Store the element being edited or deleted in a global variable
            window.selectedElementId = elementId

            // Stop further event propagation
            e.stopPropagation()
        }
    }

    return wrapper
}

// // Attach the click handlers for the menu options globally

// document.addEventListener('DOMContentLoaded', function () {
//     console.log('DOM fully loaded and parsed')

//     // Attach the click handlers for the menu options globally
//     document.getElementById('editOption').onclick = function () {
//         const elementId = window.selectedElementId
//         const jsonElement = window.ui.json.find(el => el.id == elementId)

//         if (jsonElement) {
//             showPopup(jsonElement.type, jsonElement) // Show the form for editing
//         }
//         document.getElementById('popupMenu').style.display = 'none' // Hide the popup menu
//     }

//     document.getElementById('deleteOption').onclick = function () {
//         const elementId = window.selectedElementId
//         const wrapper = document.querySelector(`[data-id="${elementId}"]`)
//         if (wrapper) {
//             wrapper.remove() // Remove the element from the UI
//             window.ui.json = window.ui.json.filter(el => el.id !== elementId) // Remove from JSON array
//             jsonToStorage() // Save the updated state
//         }
//         document.getElementById('popupMenu').style.display = 'none' // Hide the popup menu
//     }

//     document.getElementById('cancelOption').onclick = function () {
//         document.getElementById('popupMenu').style.display = 'none' // Hide the popup menu
//     }

//     // Hide the popup when clicking outside of it
//     document.onclick = function (e) {
//         const popupMenu = document.getElementById('popupMenu')
//         if (!popupMenu.contains(e.target)) {
//             popupMenu.style.display = 'none' // Hide the popup menu if clicking outside
//         }
//     }
// })

// function handleDeletion() {
//     if (window.ui.json && window.ui.json.length === 0) {
//         document.getElementById('uiContainer').innerHTML = '' // Clear the container if empty
//     }
// }

// =================== create ui form & json from popups ===================

// Submit the form and add the element. called by divs
// new
export function submitForm() {
    const name = document.getElementById('elementName').value
    const id = editingElementId || Date.now() // Use existing id if editing, otherwise generate a new one
    let command
    if (elementType !== 'output') {
        command = document.getElementById('elementCommand').value
    }

    let jsonElement = window.ui.json.find(el => el.id === id)

    // Capture the old position if editing an element
    let oldPosition = jsonElement ? jsonElement.position : { x: 100, y: 100 }

    if (jsonElement) {
        // Delete the old element from the DOM and JSON array
        const wrapper = document.querySelector(`[data-id="${id}"]`)
        if (wrapper) {
            wrapper.remove() // Remove the old element from the UI
        }
        window.ui.json = window.ui.json.filter(el => el.id !== id) // Remove from JSON array
    }

    // Create a new JSON object with updated values and retain old position
    jsonElement = {
        id: id,
        type: elementType,
        name: name,
        command: command,
        position: oldPosition, // Retain old position
    }

    // Populate additional properties based on element type
    if (elementType === 'checkbox') {
        jsonElement.checked = document.getElementById('elementChecked').checked
    } else if (elementType === 'dropdown') {
        jsonElement.options = document
            .getElementById('elementOptions')
            .value.split(/,\s*/)
        jsonElement.selected = document.getElementById('elementSelected').value
    } else if (elementType === 'range') {
        jsonElement.min = document.getElementById('elementMin').value
        jsonElement.max = document.getElementById('elementMax').value
        jsonElement.step = document.getElementById('elementStep').value
        jsonElement.value = document.getElementById('elementValue').value
    } else if (elementType === 'output') {
        jsonElement.monitor = document.getElementById('elementMonitor').value
        jsonElement.fps = document.getElementById('elementFps').value || 10
    }

    // Add the new element to the JSON array
    window.ui.json.push(jsonElement)

    // Create the new UI element
    createElementFromJSON(jsonElement)

    // Save the updated state
    jsonToStorage()

    // Close the modal
    document.getElementById('popupModal').style.display = 'none'
    editingElementId = null // Reset after submission
}
// old
// export function submitForm() {
//     const name = document.getElementById('elementName').value
//     const id = editingElementId || Date.now() // Use existing id if editing, otherwise generate a new one
//     let command
//     if (elementType !== 'output') {
//         command = document.getElementById('elementCommand').value
//     }

//     let jsonElement = window.ui.json.find(el => el.id === id)

//     // Track the old position if editing
//     let oldPosition = jsonElement ? jsonElement.position : { x: 100, y: 100 }

//     if (jsonElement) {
//         // Delete the old element from the DOM and JSON array
//         const wrapper = document.querySelector(`[data-id="${id}"]`)
//         if (wrapper) {
//             wrapper.remove() // Remove the old element from the UI
//         }
//         window.ui.json = window.ui.json.filter(el => el.id !== id) // Remove from JSON array
//     }

//     // Create a new JSON object with updated values and retain old position
//     jsonElement = {
//         id: id,
//         type: elementType,
//         name: name,
//         command: command,
//         position: {
//             x: oldPosition.x, // Retain old position
//             y: oldPosition.y, // Retain old position
//         },
//     }

//     // Populate additional properties based on element type
//     if (elementType === 'checkbox') {
//         jsonElement.checked = document.getElementById('elementChecked').checked
//     } else if (elementType === 'dropdown') {
//         jsonElement.options = document
//             .getElementById('elementOptions')
//             .value.split(/,\s*/)
//         jsonElement.selected = document.getElementById('elementSelected').value
//     } else if (elementType === 'range') {
//         jsonElement.min = document.getElementById('elementMin').value
//         jsonElement.max = document.getElementById('elementMax').value
//         jsonElement.step = document.getElementById('elementStep').value
//         jsonElement.value = document.getElementById('elementValue').value
//     } else if (elementType === 'output') {
//         jsonElement.monitor = document.getElementById('elementMonitor').value
//         jsonElement.fps = document.getElementById('elementFps').value || 10
//     }

//     // Add the new element to the JSON array
//     window.ui.json.push(jsonElement)

//     // Create the new UI element
//     createElementFromJSON(jsonElement)

//     // Save the updated state
//     jsonToStorage()

//     // Close the modal
//     document.getElementById('popupModal').style.display = 'none'
//     editingElementId = null // Reset after submission
// }

// =================== json to element ===================
function createElementFromJSON(jsonElement) {
    let elementWrapper

    // Handle element creation based on type
    if (jsonElement.type === 'button') {
        const button = document.createElement('button')
        button.innerText = jsonElement.name

        button.addEventListener('click', () => eval(jsonElement.command))

        elementWrapper = createElementWrapper(button, jsonElement.id)
    } else if (jsonElement.type === 'checkbox') {
        const checkboxWrapper = document.createElement('div')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.name = jsonElement.name
        checkbox.checked = jsonElement.checked

        const label = document.createElement('label')
        label.innerText = jsonElement.name
        label.classList.add('checkbox-label')

        // checkbox.addEventListener('change', () => eval(jsonElement.command))
        checkbox.addEventListener('change', function () {
            const value = checkbox.checked
            const checked = checkbox.checked
            eval(jsonElement.command)
        })

        checkboxWrapper.appendChild(checkbox)
        checkboxWrapper.appendChild(label)
        elementWrapper = createElementWrapper(checkboxWrapper, jsonElement.id)
    } else if (jsonElement.type === 'dropdown') {
        const selectWrapper = document.createElement('div')
        selectWrapper.classList.add('dropdown-wrapper')

        const select = document.createElement('select')
        select.name = jsonElement.name
        jsonElement.options.forEach(optionText => {
            const option = document.createElement('option')
            option.value = optionText
            option.text = optionText
            if (option.value === jsonElement.selected) {
                option.selected = true
            }
            select.appendChild(option)
        })

        const label = document.createElement('label')
        label.innerText = jsonElement.name
        selectWrapper.appendChild(label)
        selectWrapper.appendChild(select)

        // select.addEventListener('change', () => eval(jsonElement.command))
        select.addEventListener('change', function () {
            const value = select.value
            eval(jsonElement.command)
        })

        elementWrapper = createElementWrapper(selectWrapper, jsonElement.id)
    } else if (jsonElement.type === 'range') {
        const rangeWrapper = document.createElement('div')
        const range = document.createElement('input')
        range.type = 'range'
        range.name = jsonElement.name
        range.min = jsonElement.min
        range.max = jsonElement.max
        range.step = jsonElement.step
        range.value = jsonElement.value

        const rangeLabel = document.createElement('div')
        rangeLabel.classList.add('range-wrapper')
        const nameLabel = document.createElement('span')
        nameLabel.innerText = jsonElement.name
        const valueLabel = document.createElement('span')
        valueLabel.innerText = range.value

        // range.addEventListener('input', () => eval(jsonElement.command))
        range.addEventListener('input', function () {
            valueLabel.innerText = range.value
            const value = range.value
            eval(jsonElement.command)
        })

        rangeLabel.appendChild(nameLabel)
        rangeLabel.appendChild(valueLabel)
        rangeWrapper.appendChild(rangeLabel)
        rangeWrapper.appendChild(range)
        elementWrapper = createElementWrapper(rangeWrapper, jsonElement.id)
    } else if (jsonElement.type === 'output') {
        const monitorWrapper = document.createElement('div')
        monitorWrapper.classList.add('output-wrapper')

        const label = document.createElement('label')
        label.innerText = jsonElement.name

        const output = document.createElement('output')
        output.name = jsonElement.name

        let previousValue = null

        function checkValue() {
            let currentValue
            try {
                currentValue = eval(jsonElement.monitor)
            } catch (error) {
                console.error('Monitor command execution failed: ', error)
            }

            if (currentValue !== previousValue) {
                output.value = currentValue
                previousValue = currentValue
            }
        }

        setInterval(checkValue, 1000 / jsonElement.fps)

        monitorWrapper.appendChild(label)
        monitorWrapper.appendChild(output)
        elementWrapper = createElementWrapper(monitorWrapper, jsonElement.id)
    }

    // Apply the element's position from JSON
    elementWrapper.style.left = jsonElement.position.x + 'px'
    elementWrapper.style.top = jsonElement.position.y + 'px'

    // Append the recreated element to the UI container
    // document.getElementById('uiContainer').appendChild(elementWrapper)
    document.getElementById('uiContainer').appendChild(elementWrapper)
    // }
}

// =================== ui element utilities ===================

// Make an element draggable when Ctrl is pressed
function dragMouseDown(e) {
    // Only start dragging if Ctrl key is held down
    // if (!e.ctrlKey) return

    e.preventDefault()
    currentDragElement = e.target.closest('.ui-element')

    // Get initial mouse position and element position
    const uiContainerTop = document
        .getElementById('uiContainer')
        .getBoundingClientRect().top
    offsetX = e.clientX - currentDragElement.getBoundingClientRect().left
    offsetY =
        e.clientY -
        currentDragElement.getBoundingClientRect().top +
        uiContainerTop

    console.log('Initial Mouse Position:', e.clientX, e.clientY)
    console.log(
        'Initial Element Position:',
        currentDragElement.style.left,
        currentDragElement.style.top
    )
    console.log('Calculated Offsets:', offsetX, offsetY)

    document.onmousemove = elementDrag
    document.onmouseup = closeDragElement
}

// Drag the element
function elementDrag(e) {
    e.preventDefault()
    const newX = e.clientX - offsetX
    const newY = e.clientY - offsetY

    // Update the UI element's position in the DOM
    currentDragElement.style.left = newX + 'px'
    currentDragElement.style.top = newY + 'px'
}

function closeDragElement() {
    document.onmousemove = null
    document.onmouseup = null

    // Update the associated JSON's position after dragging stops
    const elementId = currentDragElement.dataset.id
    const jsonElement = window.ui.json.find(el => el.id == elementId)

    if (jsonElement) {
        // Get the current position directly (relative to the parent container)
        jsonElement.position.x = parseInt(currentDragElement.style.left, 10)
        jsonElement.position.y = parseInt(currentDragElement.style.top, 10)
    }
    // save the updated state to localStorage
    jsonToStorage()
}

// Functions to recreate all elements from stored JSON
function loadElementsFromJSON() {
    const uiContainer = document.getElementById('uiContainer')

    // Clear existing elements to avoid duplication
    uiContainer.innerHTML = ''

    // Loop through each element in the window.ui.json array
    window.ui.json.forEach(jsonElement => {
        createElementFromJSON(jsonElement) // Create each element from JSON
    })
}

// =================== localStorage utilities ===================

// let containerDiv = 'uiContainer' // div for dynamically added UI elements
let localStorageName // default localStorage name for caching current elements
export function setStorageName(name) {
    localStorageName = name
}

export function clearElements() {
    localStorage.removeItem(localStorageName)
    window.ui.json = []
}
const minJsonString =
    '[{"command":"ui.anim.start()","id":1728678676436,"name":"start","position":{"x":29,"y":33},"type":"button"},{"command":"ui.anim.stop()","id":1728927362120,"name":"stop","position":{"x":92,"y":34},"type":"button"},{"command":"ui.reset()","id":1728927569824,"name":"reset","position":{"x":59,"y":68},"type":"button"},{"command":"ui.anim.setFps(value)","id":1728682054456,"max":"60","min":"0","name":"fps","position":{"x":165,"y":35},"step":"1","type":"range","value":"30"},{"id":1729270887157,"type":"output","name":"ticks","position":{"x":330,"y":37},"monitor":"ui.model.ticks","fps":"10"}]'
const minJson = JSON.parse(minJsonString)

// ui.json to localStorage. was saveUIState
function jsonToStorage() {
    const jsonString = JSON.stringify(window.ui.json) // Convert to string
    localStorage.setItem(localStorageName, jsonString) // Save it to localStorage
}

// =================== functions called by users html file ===================

// let AppName
export function setAppState(
    model,
    view,
    anim,
    storageName = model.constructor.name
) {
    Object.assign(window.ui, { model, view, anim })
    setStorageName(storageName)

    anim.stop() // stop the animation, use uielements to control
    view.draw() // draw once to see the model before running animator

    console.log('localStorageName', localStorageName)
}

// was loadUIState, now includes minJson for new html file
export function createElements(useMinElements = true) {
    const savedState = localStorage.getItem(localStorageName)
    if (savedState) {
        window.ui.json = JSON.parse(savedState) // Convert back to array
    } else if (useMinElements) {
        window.ui.json = minJson
    } else {
        return
    }
    loadElementsFromJSON()
}

// a bit risky: depends on model, view, anim stored in ui by app
export function reset() {
    window.ui.model.reset()
    // window.ui.view.reset()
    window.ui.anim.reset()
    window.ui.view.draw()
}

Object.assign(window.ui, {
    showPopup,
    submitForm,
    cancel,
    reset,
    util,

    createElements,
    jsonToStorage,
})
