(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.morphdom=factory())})(this,function(){"use strict";var DOCUMENT_FRAGMENT_NODE=11;function morphAttrs(fromNode,toNode){var toNodeAttrs=toNode.attributes;var attr;var attrName;var attrNamespaceURI;var attrValue;var fromValue;if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE||fromNode.nodeType===DOCUMENT_FRAGMENT_NODE){return}for(var i=toNodeAttrs.length-1;i>=0;i--){attr=toNodeAttrs[i];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;attrValue=attr.value;if(attrNamespaceURI){attrName=attr.localName||attrName;fromValue=fromNode.getAttributeNS(attrNamespaceURI,attrName);if(fromValue!==attrValue){if(attr.prefix==="xmlns"){attrName=attr.name}fromNode.setAttributeNS(attrNamespaceURI,attrName,attrValue)}}else{fromValue=fromNode.getAttribute(attrName);if(fromValue!==attrValue){fromNode.setAttribute(attrName,attrValue)}}}var fromNodeAttrs=fromNode.attributes;for(var d=fromNodeAttrs.length-1;d>=0;d--){attr=fromNodeAttrs[d];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;if(attrNamespaceURI){attrName=attr.localName||attrName;if(!toNode.hasAttributeNS(attrNamespaceURI,attrName)){fromNode.removeAttributeNS(attrNamespaceURI,attrName)}}else{if(!toNode.hasAttribute(attrName)){fromNode.removeAttribute(attrName)}}}}var range;var NS_XHTML="http://www.w3.org/1999/xhtml";var doc=typeof document==="undefined"?undefined:document;var HAS_TEMPLATE_SUPPORT=!!doc&&"content"in doc.createElement("template");var HAS_RANGE_SUPPORT=!!doc&&doc.createRange&&"createContextualFragment"in doc.createRange();function createFragmentFromTemplate(str){var template=doc.createElement("template");template.innerHTML=str;return template.content.childNodes[0]}function createFragmentFromRange(str){if(!range){range=doc.createRange();range.selectNode(doc.body)}var fragment=range.createContextualFragment(str);return fragment.childNodes[0]}function createFragmentFromWrap(str){var fragment=doc.createElement("body");fragment.innerHTML=str;return fragment.childNodes[0]}function toElement(str){str=str.trim();if(HAS_TEMPLATE_SUPPORT){return createFragmentFromTemplate(str)}else if(HAS_RANGE_SUPPORT){return createFragmentFromRange(str)}return createFragmentFromWrap(str)}function compareNodeNames(fromEl,toEl){var fromNodeName=fromEl.nodeName;var toNodeName=toEl.nodeName;var fromCodeStart,toCodeStart;if(fromNodeName===toNodeName){return true}fromCodeStart=fromNodeName.charCodeAt(0);toCodeStart=toNodeName.charCodeAt(0);if(fromCodeStart<=90&&toCodeStart>=97){return fromNodeName===toNodeName.toUpperCase()}else if(toCodeStart<=90&&fromCodeStart>=97){return toNodeName===fromNodeName.toUpperCase()}else{return false}}function createElementNS(name,namespaceURI){return!namespaceURI||namespaceURI===NS_XHTML?doc.createElement(name):doc.createElementNS(namespaceURI,name)}function moveChildren(fromEl,toEl){var curChild=fromEl.firstChild;while(curChild){var nextChild=curChild.nextSibling;toEl.appendChild(curChild);curChild=nextChild}return toEl}function syncBooleanAttrProp(fromEl,toEl,name){if(fromEl[name]!==toEl[name]){fromEl[name]=toEl[name];if(fromEl[name]){fromEl.setAttribute(name,"")}else{fromEl.removeAttribute(name)}}}var specialElHandlers={OPTION:function(fromEl,toEl){var parentNode=fromEl.parentNode;if(parentNode){var parentName=parentNode.nodeName.toUpperCase();if(parentName==="OPTGROUP"){parentNode=parentNode.parentNode;parentName=parentNode&&parentNode.nodeName.toUpperCase()}if(parentName==="SELECT"&&!parentNode.hasAttribute("multiple")){if(fromEl.hasAttribute("selected")&&!toEl.selected){fromEl.setAttribute("selected","selected");fromEl.removeAttribute("selected")}parentNode.selectedIndex=-1}}syncBooleanAttrProp(fromEl,toEl,"selected")},INPUT:function(fromEl,toEl){syncBooleanAttrProp(fromEl,toEl,"checked");syncBooleanAttrProp(fromEl,toEl,"disabled");if(fromEl.value!==toEl.value){fromEl.value=toEl.value}if(!toEl.hasAttribute("value")){fromEl.removeAttribute("value")}},TEXTAREA:function(fromEl,toEl){var newValue=toEl.value;if(fromEl.value!==newValue){fromEl.value=newValue}var firstChild=fromEl.firstChild;if(firstChild){var oldValue=firstChild.nodeValue;if(oldValue==newValue||!newValue&&oldValue==fromEl.placeholder){return}firstChild.nodeValue=newValue}},SELECT:function(fromEl,toEl){if(!toEl.hasAttribute("multiple")){var selectedIndex=-1;var i=0;var curChild=fromEl.firstChild;var optgroup;var nodeName;while(curChild){nodeName=curChild.nodeName&&curChild.nodeName.toUpperCase();if(nodeName==="OPTGROUP"){optgroup=curChild;curChild=optgroup.firstChild;if(!curChild){curChild=optgroup.nextSibling;optgroup=null}}else{if(nodeName==="OPTION"){if(curChild.hasAttribute("selected")){selectedIndex=i;break}i++}curChild=curChild.nextSibling;if(!curChild&&optgroup){curChild=optgroup.nextSibling;optgroup=null}}}fromEl.selectedIndex=selectedIndex}}};var ELEMENT_NODE=1;var DOCUMENT_FRAGMENT_NODE$1=11;var TEXT_NODE=3;var COMMENT_NODE=8;function noop(){}function defaultGetNodeKey(node){if(node){return node.getAttribute&&node.getAttribute("id")||node.id}}function morphdomFactory(morphAttrs){return function morphdom(fromNode,toNode,options){if(!options){options={}}if(typeof toNode==="string"){if(fromNode.nodeName==="#document"||fromNode.nodeName==="HTML"){var toNodeHtml=toNode;toNode=doc.createElement("html");toNode.innerHTML=toNodeHtml}else if(fromNode.nodeName==="BODY"){var toNodeBody=toNode;toNode=doc.createElement("html");toNode.innerHTML=toNodeBody;var bodyElement=toNode.querySelector("body");if(bodyElement){toNode=bodyElement}}else{toNode=toElement(toNode)}}else if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE$1){toNode=toNode.firstElementChild}var getNodeKey=options.getNodeKey||defaultGetNodeKey;var onBeforeNodeAdded=options.onBeforeNodeAdded||noop;var onNodeAdded=options.onNodeAdded||noop;var onBeforeElUpdated=options.onBeforeElUpdated||noop;var onElUpdated=options.onElUpdated||noop;var onBeforeNodeDiscarded=options.onBeforeNodeDiscarded||noop;var onNodeDiscarded=options.onNodeDiscarded||noop;var onBeforeElChildrenUpdated=options.onBeforeElChildrenUpdated||noop;var skipFromChildren=options.skipFromChildren||noop;var addChild=options.addChild||function(parent,child){return parent.appendChild(child)};var childrenOnly=options.childrenOnly===true;var fromNodesLookup=Object.create(null);var keyedRemovalList=[];function addKeyedRemoval(key){keyedRemovalList.push(key)}function walkDiscardedChildNodes(node,skipKeyedNodes){if(node.nodeType===ELEMENT_NODE){var curChild=node.firstChild;while(curChild){var key=undefined;if(skipKeyedNodes&&(key=getNodeKey(curChild))){addKeyedRemoval(key)}else{onNodeDiscarded(curChild);if(curChild.firstChild){walkDiscardedChildNodes(curChild,skipKeyedNodes)}}curChild=curChild.nextSibling}}}function removeNode(node,parentNode,skipKeyedNodes){if(onBeforeNodeDiscarded(node)===false){return}if(parentNode){parentNode.removeChild(node)}onNodeDiscarded(node);walkDiscardedChildNodes(node,skipKeyedNodes)}function indexTree(node){if(node.nodeType===ELEMENT_NODE||node.nodeType===DOCUMENT_FRAGMENT_NODE$1){var curChild=node.firstChild;while(curChild){var key=getNodeKey(curChild);if(key){fromNodesLookup[key]=curChild}indexTree(curChild);curChild=curChild.nextSibling}}}indexTree(fromNode);function handleNodeAdded(el){onNodeAdded(el);var curChild=el.firstChild;while(curChild){var nextSibling=curChild.nextSibling;var key=getNodeKey(curChild);if(key){var unmatchedFromEl=fromNodesLookup[key];if(unmatchedFromEl&&compareNodeNames(curChild,unmatchedFromEl)){curChild.parentNode.replaceChild(unmatchedFromEl,curChild);morphEl(unmatchedFromEl,curChild)}else{handleNodeAdded(curChild)}}else{handleNodeAdded(curChild)}curChild=nextSibling}}function cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey){while(curFromNodeChild){var fromNextSibling=curFromNodeChild.nextSibling;if(curFromNodeKey=getNodeKey(curFromNodeChild)){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}}function morphEl(fromEl,toEl,childrenOnly){var toElKey=getNodeKey(toEl);if(toElKey){delete fromNodesLookup[toElKey]}if(!childrenOnly){var beforeUpdateResult=onBeforeElUpdated(fromEl,toEl);if(beforeUpdateResult===false){return}else if(beforeUpdateResult instanceof HTMLElement){fromEl=beforeUpdateResult;indexTree(fromEl)}morphAttrs(fromEl,toEl);onElUpdated(fromEl);if(onBeforeElChildrenUpdated(fromEl,toEl)===false){return}}if(fromEl.nodeName!=="TEXTAREA"){morphChildren(fromEl,toEl)}else{specialElHandlers.TEXTAREA(fromEl,toEl)}}function morphChildren(fromEl,toEl){var skipFrom=skipFromChildren(fromEl,toEl);var curToNodeChild=toEl.firstChild;var curFromNodeChild=fromEl.firstChild;var curToNodeKey;var curFromNodeKey;var fromNextSibling;var toNextSibling;var matchingFromEl;outer:while(curToNodeChild){toNextSibling=curToNodeChild.nextSibling;curToNodeKey=getNodeKey(curToNodeChild);while(!skipFrom&&curFromNodeChild){fromNextSibling=curFromNodeChild.nextSibling;if(curToNodeChild.isSameNode&&curToNodeChild.isSameNode(curFromNodeChild)){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}curFromNodeKey=getNodeKey(curFromNodeChild);var curFromNodeType=curFromNodeChild.nodeType;var isCompatible=undefined;if(curFromNodeType===curToNodeChild.nodeType){if(curFromNodeType===ELEMENT_NODE){if(curToNodeKey){if(curToNodeKey!==curFromNodeKey){if(matchingFromEl=fromNodesLookup[curToNodeKey]){if(fromNextSibling===matchingFromEl){isCompatible=false}else{fromEl.insertBefore(matchingFromEl,curFromNodeChild);if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=matchingFromEl;curFromNodeKey=getNodeKey(curFromNodeChild)}}else{isCompatible=false}}}else if(curFromNodeKey){isCompatible=false}isCompatible=isCompatible!==false&&compareNodeNames(curFromNodeChild,curToNodeChild);if(isCompatible){morphEl(curFromNodeChild,curToNodeChild)}}else if(curFromNodeType===TEXT_NODE||curFromNodeType==COMMENT_NODE){isCompatible=true;if(curFromNodeChild.nodeValue!==curToNodeChild.nodeValue){curFromNodeChild.nodeValue=curToNodeChild.nodeValue}}}if(isCompatible){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}if(curToNodeKey&&(matchingFromEl=fromNodesLookup[curToNodeKey])&&compareNodeNames(matchingFromEl,curToNodeChild)){if(!skipFrom){addChild(fromEl,matchingFromEl)}morphEl(matchingFromEl,curToNodeChild)}else{var onBeforeNodeAddedResult=onBeforeNodeAdded(curToNodeChild);if(onBeforeNodeAddedResult!==false){if(onBeforeNodeAddedResult){curToNodeChild=onBeforeNodeAddedResult}if(curToNodeChild.actualize){curToNodeChild=curToNodeChild.actualize(fromEl.ownerDocument||doc)}addChild(fromEl,curToNodeChild);handleNodeAdded(curToNodeChild)}}curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling}cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey);var specialElHandler=specialElHandlers[fromEl.nodeName];if(specialElHandler){specialElHandler(fromEl,toEl)}}var morphedNode=fromNode;var morphedNodeType=morphedNode.nodeType;var toNodeType=toNode.nodeType;if(!childrenOnly){if(morphedNodeType===ELEMENT_NODE){if(toNodeType===ELEMENT_NODE){if(!compareNodeNames(fromNode,toNode)){onNodeDiscarded(fromNode);morphedNode=moveChildren(fromNode,createElementNS(toNode.nodeName,toNode.namespaceURI))}}else{morphedNode=toNode}}else if(morphedNodeType===TEXT_NODE||morphedNodeType===COMMENT_NODE){if(toNodeType===morphedNodeType){if(morphedNode.nodeValue!==toNode.nodeValue){morphedNode.nodeValue=toNode.nodeValue}return morphedNode}else{morphedNode=toNode}}}if(morphedNode===toNode){onNodeDiscarded(fromNode)}else{if(toNode.isSameNode&&toNode.isSameNode(morphedNode)){return}morphEl(morphedNode,toNode,childrenOnly);if(keyedRemovalList){for(var i=0,len=keyedRemovalList.length;i<len;i++){var elToRemove=fromNodesLookup[keyedRemovalList[i]];if(elToRemove){removeNode(elToRemove,elToRemove.parentNode,false)}}}}if(!childrenOnly&&morphedNode!==fromNode&&fromNode.parentNode){if(morphedNode.actualize){morphedNode=morphedNode.actualize(fromNode.ownerDocument||doc)}fromNode.parentNode.replaceChild(morphedNode,fromNode)}return morphedNode}}var morphdom=morphdomFactory(morphAttrs);return morphdom});
/* dc-lite: a small runtime that renders the site's page templates outside Claude.
   Supports {{expr}} in text and attributes, <sc-if value>, <sc-for list as>, data-dc-on-<event> handlers and data-dc-ref callbacks.
   Re-renders are patched into the page with morphdom, so the 3D canvas and form fields keep their state. */
(function () {
  "use strict";
  var EVENTS = ["click", "input", "change", "submit", "keydown"];
  function DCLogic() { this.state = {}; }
  DCLogic.prototype.setState = function (p) {
    var next = typeof p === "function" ? p(this.state) : p;
    this.state = Object.assign({}, this.state, next || {});
    schedule(this);
  };
  DCLogic.prototype.forceUpdate = function () { schedule(this); };
  window.DCLogic = DCLogic;

  function lookup(scope, expr) {
    var parts = expr.trim().split("."), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  var ONE = /^\s*\{\{([^}]+)\}\}\s*$/, ANY = /\{\{([^}]+)\}\}/g;
  function interp(str, scope) {
    return str.replace(ANY, function (_, e) { var v = lookup(scope, e); return v == null || v === false ? "" : String(v); });
  }

  var reg = [];   // handlers and refs for the current render, by index
  function build(src, scope, out) {
    for (var n = src.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) { out.appendChild(document.createTextNode(n.nodeValue.indexOf("{{") < 0 ? n.nodeValue : interp(n.nodeValue, scope))); continue; }
      if (n.nodeType !== 1) continue;
      var tag = n.tagName.toLowerCase();
      if (tag === "sc-if") {
        var m = ONE.exec(n.getAttribute("value") || ""); if (m ? lookup(scope, m[1]) : false) build(n, scope, out);
        continue;
      }
      if (tag === "sc-for") {
        var lm = ONE.exec(n.getAttribute("list") || ""), list = lm ? lookup(scope, lm[1]) : null, as = n.getAttribute("as") || "item";
        (list || []).forEach(function (item, i) { var s = Object.create(scope); s[as] = item; s.$index = i; build(n, s, out); });
        continue;
      }
      var el = tag === "svg" || n.namespaceURI === "http://www.w3.org/2000/svg" ? document.createElementNS(n.namespaceURI, n.tagName) : document.createElement(n.tagName);
      for (var a = 0; a < n.attributes.length; a++) {
        var at = n.attributes[a], name = at.name, val = at.value;
        if (name.indexOf("hint-") === 0) continue;
        if (name.indexOf("data-dc-on-") === 0 || name === "data-dc-ref") {
          var hm = ONE.exec(val), fn = hm ? lookup(scope, hm[1]) : null;
          if (typeof fn === "function") { reg.push(fn); el.setAttribute(name === "data-dc-ref" ? "data-dc-ref" : "data-dc-h-" + name.slice(11), String(reg.length - 1)); }
          continue;
        }
        if (val.indexOf("{{") >= 0) {
          var om = ONE.exec(val);
          if (om) { var v = lookup(scope, om[1]); if (v == null || v === false) continue; if (v === true) v = ""; el.setAttribute(name, String(v)); }
          else el.setAttribute(name, interp(val, scope));
        } else el.setAttribute(name, val);
      }
      build(n.content || n, scope, el);
      out.appendChild(el);
    }
  }

  var inst = null, tpl = null, root = null, pending = false;
  function render() {
    pending = false; reg = [];
    var vals = inst.renderVals ? inst.renderVals() : {};
    var next = root.cloneNode(false); build(tpl.content, vals, next);
    morphdom(root, next, {
      childrenOnly: true,
      onBeforeElUpdated: function (from, to) {
        if (from.tagName === "CANVAS") {   // the 3D renderer owns its canvas size; only refresh the handler/ref ids
          ["data-dc-ref"].forEach(function (k) { if (to.hasAttribute(k)) from.setAttribute(k, to.getAttribute(k)); });
          return false;
        }
        if ((from.tagName === "INPUT" || from.tagName === "TEXTAREA" || from.tagName === "SELECT") && from === document.activeElement && from.type !== "range") {
          to.value = from.value;   // don't fight the user's typing
        }
        return true;
      }
    });
    var refs = root.querySelectorAll("[data-dc-ref]");
    for (var i = 0; i < refs.length; i++) { var f = reg[+refs[i].getAttribute("data-dc-ref")]; if (f) f.call(inst, refs[i]); }
  }
  function schedule(c) {
    if (c !== inst || pending) return; pending = true;
    (window.requestAnimationFrame || setTimeout)(function () { render(); if (inst.componentDidUpdate) inst.componentDidUpdate(); });
  }
  function dispatch(type) {
    return function (e) {
      for (var el = e.target; el && el !== root.parentNode; el = el.parentNode) {
        if (el.nodeType === 1 && el.hasAttribute("data-dc-h-" + type)) {
          var f = reg[+el.getAttribute("data-dc-h-" + type)];
          if (f) { f.call(inst, e); }
          return;
        }
      }
    };
  }
  window.dcStart = function (Component, props) {
    tpl = document.getElementById("dc-tpl"); root = document.getElementById("dc-root");
    inst = new Component(); inst.props = props || {}; if (!inst.state) inst.state = {};
    EVENTS.forEach(function (t) { root.addEventListener(t, dispatch(t), t === "submit"); });
    render();
    if (inst.componentDidMount) inst.componentDidMount();
    window.addEventListener("pagehide", function () { if (inst && inst.componentWillUnmount) inst.componentWillUnmount(); });
  };
})();
