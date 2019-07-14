module.exports = {
    navigate: {
        name: "Navigate",
        info: "Direct the browser to a specific URL.",
        fields: ["value"],
        friendly: "navigate to {value}"
    },
    click: {
        name: "Click",
        info: "Use this to execute a mouse click on the element specified by the target.",
        fields: ["target"],
        friendly: "click on {target}"
    },
    clickText: {
        name: "Click Text",
        info: "Use this to execute a mouse click on the first element that contains the mentioned text.",
        fields: ["value"],
        friendly: "click element with text {value}"
    },
    input: {
        name: "Input text",
        info: "Use this to input the value text into a the field specified by the target.",
        fields: ["target", "value"],
        friendly: "input {value} on {target}"
    },
    assertTitle: {
        name: "Assert title",
        info: "Check if the title contains the specific value.",
        fields: ["value"],
        friendly: "assert title {value}"
    },
    assertText: {
        name: "Assert text",
        info: "Check if the specific value is present anywhere on the page.",
        fields: ["value"],
        friendly: "assert text {value}"
    },
    assertValue: {
        name: "Assert value",
        info: "Check if the target field's value contains the specific value.",
        fields: ["target", "value"],
        friendly: "assert value {value} on {target}"
    }
    /*
    javascript: {
        name: "Javascript",
        info: "Specify javascript code to execute against page.",
        fields: ["code"],
        friendly: "javascript"
    },
    if: {
        name: "If",
        info: "",
        fields: ["expression"],
        friendly: "if {expression}"
    },
    else: {
        name: "Else",
        info: "",
        fields: [],
        friendly: "else"
    },
    end: {
        name: "End",
        info: "",
        fields: [],
        friendly: "end"
    }
    */
    /*
    add selection
    answer on next prompt
    assert
    assert alert
    assert checked
    assert confirmation
    assert editable
    assert element present
    assert element not present
    assert not checked
    assert not editable
    assert not selected value
    assert not text
    assert prompt
    assert selected value
    assert selected label
    * assert text
    * assert title
    * assert value
    check
    choose cancel on next confirmation
    choose cancel on next prompt
    choose ok on next confirmation
    * click
    click at
    close
    debugger
    do
    double click
    double click at
    drag and drop to object
    echo
    edit content
    else
    else if
    end
    execute script
    execute async script
    mouse down
    mouse down at
    mouse move at
    mouse out
    mouse over
    mouse up
    mouse up at
    open
    pause
    remove selection
    repeat if
    run
    run script
    select
    select frame
    select window
    send keys
    set speed
    set window size
    store
    store attribute
    store json
    store text
    store title
    store value
    store window handle
    store xpath count
    submit
    times
    for each
    type
    uncheck
    verify
    verify checked
    verify editable
    verify element present
    verify element not present
    verify not checked
    verify not editable
    verify not selected value
    verify not text
    verify selected label
    verify selected value
    verify text
    verify title
    verify value
    wait for element editable
    wait for element not editable
    wait for element not present
    wait for element not visible
    wait for element present
    wait for element visible
    webdriver answer on visible prompt
    webdriver choose cancel on visible confirmation
    webdriver choose cancel on visible prompt
    webdriver choose ok on visible confirmation
    */
}