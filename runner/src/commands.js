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
        fields: ["target"],
        friendly: "click on {target}"
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
}