// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Factor syntax highlight - simple mode
//
// by Dimage Sapelkin (https://github.com/kerabromsmu)

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"), require("codemirror/addon/mode/simple"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror", "codemirror/addon/mode/simple"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    CodeMirror.defineSimpleMode("tgs", {
        // The start state contains the rules that are intially used
        start: [
            {regex: /\/\/.*/, token: "comment"},
            {regex: /\/\*/, token: "comment", next: "comment"},
            {regex: /@[A-Za-z0-9-]+/, push: "script", token: "script-id"},
            {regex: /#[A-Za-z0-9-]+/, next: "block", token: "block-id"},
            {regex: /\?[A-Za-z0-9-]+/, next: "", token: "block-id"},
            {regex: /->|=>/, token: "keyword"}
        ],
        blockExtension: [
            { regex: /#[A-Za-z0-9-]+/, token: "extension-ref", pop: true }
        ],
        script: [
            { regex: /\/\/.*/, token: "comment" },
            { regex: /\{/, token: "operator", next: "scriptBlock"}
        ],
        conditionBlock: [
            { regex: /\{/, next: "coloredCondition" },
        ],
        scriptBlock: [
            { regex: /\/\/.*/, token: "comment" },
            { regex: /\/\*/, token: "comment", push: "comment" },
            { regex: /if|for|elseif/, token: "builtin", push: "conditional" },
            { regex: /true|false/, token: "boolean" },
            { regex: /".*?"/, token: "string" },
            { regex: /[0-9]+/, token: "numeric"},
            { regex: /[A-Za-z0-9]+/, token: "variable" },
            { regex: /\}/, token: "operator", pop: true },
        ],
        conditional: [
            { regex: /\(/, next: "coloredCondition" }
        ],
        block: [
            { regex: /\/\/.*/, token: "comment" },
            { regex: /\/\*/, token: "comment", push: "comment" },
            { regex: /before:|after:/, token: "block-inline-item", push: "blockExtension" },
            { regex: /@[A-Za-z0-9-]+/, push: "script", token: "script-id-b" },
            { regex: /[\[\]]/, token: "block-inline-item" },
            { regex: /\/\*/, token: "comment", next: "comment" },
            { regex: /%(?=[A-Za-z0-9\.]+%)/, token: "variable", next: "inlineVariable" },
            { regex: /(?=#).*?/, next: "start" },
            { regex: /\*/, next: "link", token: "linkb"},
            { regex: /<[A-Za-z0-9 -]+>/, token: "block-inline-item" },
            // tag
            { regex: /</, token: "block-inline-item", push: "tag" },
            { regex: /\(\?/, token: "block-inline-item", push: "condition" }
        ],
        tag: [
            { regex: /[A-Za-z0-9-=".]+/, token: "block-inline-item" },
            { regex: />/, token: "block-inline-item", pop: true }
        ],
        coloredCondition: [
            { regex: /".*?"/, token: "string" },
            { regex: /[0-9]+/, token: "numeric"},
            { regex: /[A-Za-z0-9]+/, token: "variable" },
            { regex: /\)/, next: "script" },
            { regex: /\}/, pop: true }
        ],
        condition: [
            { regex: /.*?\)/, token: "block-inline-item", pop: true}
        ],
        styleEnum: [
            { regex: /[A-Za-z0-9-]+/, token: "block-inline-item" },
            { regex: />/, token: "block-inline-item", next: "block" }
        ],
        inlineVariable: [
            { regex: /[A-Za-z0-9-\.]+/, token: "variable" },
            { regex: /%/, token: "variable", next: "block"}
        ],
        link: [
            { regex: /\(/, push: "condition", token: "block-inline-item" },
            { regex: /->|=>/, token: "linkb", next: "linkRef"},
            { regex: /\[[A-Za-z0-9- ]+\]/, token: "block-inline-item" }
        ],
        linkRef: [
            { regex: /[A-Za-z0-9-\/]+#[A-Za-z0-9-]+/, token: "linkref", next: "block" },
            { regex: /[A-Za-z0-9-\/]+/, token: "linkref", next: "block" },
            { regex: /#[A-Za-z0-9-]+/, token: "linkref-local", next: "block" }
        ],
        comment: [
            {regex: /.*\*\//, token: "comment", pop: true },
            {regex: /.*/, token: "comment"}
        ],
        meta: {
            dontIndentStates: ["comment"],
            lineComment: "//"
          }
    });
});