(this["webpackJsonpquick-notes"]=this["webpackJsonpquick-notes"]||[]).push([[0],{112:function(e,t,n){e.exports=n(139)},139:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(9),o=n.n(l),c=n(79),i=n(175),u=n(195),s=n(48),m=n(144),d=n(194),f=n(90),p=n(178),g=n(15),E=n(54),b={isOpen:!1,anchor:null,id:null},h=function(e,t){switch(t.type){case"OPEN":return Object(E.a)({},e,{anchor:t.payload.anchor,id:t.payload.id,isOpen:!0});case"CLOSE":return b;default:throw new Error}},y=Object(a.createContext)(),v=function(){var e=Object(a.useContext)(y);if(!e)throw new Error("useContextualMenu must be used within a ContextualMenuProvider");var t=Object(g.a)(e,2),n=t[0],r=t[1];return{isMenuOpen:n.isOpen,anchor:n.anchor,id:n.id,openMenu:function(e){var t=e.currentTarget;return r({type:"OPEN",payload:{anchor:t,id:t.dataset.id}})},closeMenu:function(){return r({type:"CLOSE"})}}};var O=function(e){var t=e.menuItems,n=v(),a=n.isMenuOpen,l=n.anchor,o=n.id,c=n.closeMenu;return r.a.createElement(f.a,{id:"contextual-menu",color:"primary",anchorEl:l,keepMounted:!0,open:a,onClose:c},t.map((function(e){var t=e.label,n=e.onClickFunc;return r.a.createElement(p.a,{key:t,onClick:function(){n(o),c()}},t)})))},k=n(20),C=function(){var e=Object(s.useSnackbar)().enqueueSnackbar;return{msgSuccess:function(t){return e(t,{variant:"success"})},msgWarning:function(t){return e(t,{variant:"warning"})},msgError:function(t){return e(t,{variant:"error"})}}},N=Object(a.createContext)();function j(){var e=Object(a.useContext)(N);if(!e)throw new Error("useNotes must be used within a NoteProvider");var t=Object(g.a)(e,2),n=t[0],r=t[1],l=C(),o=l.msgSuccess,c=l.msgError;return{notes:n,saveNotes:function(){n.length<1?c("There are no notes to save!"):(localStorage.setItem("notes",JSON.stringify(n,null,4)),o("".concat(n.length," notes successfully saved!")))},loadNotes:function(){try{var e=JSON.parse(localStorage.getItem("notes"));r(Object(k.a)(e)),o("".concat(e.length," notes successfully restored!"))}catch(t){console.error(t),c("There are no notes in storage!")}},addNote:function(e){return Array.isArray(e)?r([].concat(Object(k.a)(n),Object(k.a)(e))):r([].concat(Object(k.a)(n),[e]))},removeNote:function(e){return r(n.filter((function(t){return t.id!==e})))},clearNotes:function(){return r([])}}}var x=n(179),w=n(180),S=n(182),I=n(181),M=n(83),T=n.n(M),B=n(25),A=Object(m.a)((function(e){return{card:{background:"linear-gradient(340deg, rgb(209, 209, 54) 0%, rgb(255, 255, 136) 20%)"},header:{padding:e.spacing(2,2,0,2)},title:{},content:{maxHeight:"10rem",overflowY:"scroll"}}})),P=function(e){var t=e.id,n=e.title,a=e.content,l=v().openMenu,o=A();return r.a.createElement(x.a,{"data-note-id":t,square:!0,className:o.card},r.a.createElement(w.a,{title:n,titleTypographyProps:{component:"h3",variant:"h5",className:o.title},action:r.a.createElement(I.a,{"aria-label":"More Info","data-id":t,onClick:l,size:"small"},r.a.createElement(T.a,null)),className:o.header}),r.a.createElement(S.a,{className:o.content},r.a.createElement(B.a,{variant:"body2"},a)))},F=n(193),q=n(186),z=n(86),D=n.n(z),L=n(87),R=n.n(L),G=n(88),J=n.n(G),W=n(89),H=n.n(W),K=n(177),Q=n(192),U=n(75),Y=n(143),Z=n(183),$=n(184),_=Object(U.a)((function(e){return{listItem:{padding:e.spacing(1)},listItemIcon:{minWidth:0,padding:e.spacing(0,2,0,1)},listItemText:{margin:0}}})),V=function(e){var t=e.label,n=e.icon,a=e.onClick,l=_();return r.a.createElement(Y.a,{button:!0,className:l.listItem,onClick:a},r.a.createElement(Z.a,{className:l.listItemIcon},n),r.a.createElement($.a,{primary:t,primaryTypographyProps:{variant:"body1"},className:l.listItemText}))},X=n(185),ee=n(62),te=n.n(ee),ne=Object(U.a)((function(e){return{menuButton:{marginRight:e.spacing(1)},list:{width:"256px"}}})),ae=function(e){var t=e.top,n=e.children,l=Object(a.useState)(!1),o=Object(g.a)(l,2),c=o[0],i=o[1],u=function(e){return function(t){(!t||"keydown"!==t.type||"Tab"!==t.key&&"Shift"!==t.key)&&i(e)}},s=ne();return r.a.createElement(r.a.Fragment,null,r.a.createElement(X.a,{anchor:"left",open:c,onClose:u(!1)},r.a.createElement("div",{role:"presentation",className:s.list,onClick:u(!1),onKeyDown:u(!1)},r.a.createElement(q.a,null,r.a.createElement(I.a,{color:"inherit",edge:"start","aria-label":"close drawer",onClick:u(!1),className:s.menuButton},r.a.createElement(te.a,null)),t),n)),r.a.createElement(I.a,{color:"inherit",edge:"start","aria-label":"open drawer",onClick:u(!0),className:s.menuButton},r.a.createElement(te.a,null)))},re=n(187),le=n(188),oe=n(190),ce=n(189),ie=n(196),ue=n(191),se=n(56),me={hasError:!1,errorMsg:""},de=function(){var e=C().msgError,t=Object(a.useState)(me),n=Object(g.a)(t,2),l=n[0],o=n[1];return{hasError:l.hasError,errorMsg:l.errorMsg,isBlank:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r.a.createElement("span",null,"Text field cannot be blank!");return""===t?(o({hasError:!0,errorMsg:n}),e(n),!0):(o(me),!1)},isDuplicate:function(t,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:r.a.createElement("span",null,'"',r.a.createElement("strong",null,t),'" is a duplicate!');return n.some((function(e){return e.toLowerCase()===t.toLowerCase()}))?(o({hasError:!0,errorMsg:a}),e(a),!0):(o(me),!1)},isInvalid:function(t,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:r.a.createElement("span",null,"Invalid data entered!");return n.test(t)?(o(me),!1):(o({hasError:!0,errorMsg:a}),e(a),!0)}}},fe=Object(m.a)((function(e){return{header:{padding:e.spacing(2,2,0,2),textAlign:"center"},actions:{alignItems:"center",display:"flex",justifyContent:"space-between"}}})),pe=function(e){var t=e.isOpen,n=e.handleClose,a=j(),l=a.notes,o=a.addNote,c=de(),i=c.hasError,u=c.errorMsg,s=c.isBlank,m=c.isInvalid,d=c.isDuplicate,f=fe();function p(){var e=document.querySelector("#note-title").value.trim(),t=document.querySelector("#note-content").value.trim();if(!s(e)&&!s(t)){m(e,/^[a-zA-Z0-9 _-]+$/,r.a.createElement("span",null,"Invalid characters detected"))||d(e,l.map((function(e){return e.title})))||(o({id:Object(se.generate)(),title:e,content:t}),n())}}function g(e){var t="note-title"===e.target.id,n="note-content"===e.target.id,a="note-add-button"===e.target.id;"Enter"===e.key&&(t&&document.querySelector("#note-content").focus(),n&&document.querySelector("#note-add-button").focus(),a&&p())}return r.a.createElement(re.a,{open:t,onClose:n,"aria-labelledby":"add-note-dialog-title"},r.a.createElement(le.a,{id:"add-note-dialog-title",className:f.header},"Add Note"),r.a.createElement(ce.a,null,r.a.createElement(ie.a,{error:i,helperText:u,onKeyPress:g,label:"Title",id:"note-title",autoFocus:!0,fullWidth:!0,margin:"dense",variant:"outlined",size:"small",type:"text"}),r.a.createElement(ie.a,{error:i,helperText:u,onKeyPress:g,label:"Content",id:"note-content",multiline:!0,fullWidth:!0,margin:"dense",variant:"outlined",size:"small",type:"text"})),r.a.createElement(oe.a,{className:f.actions},r.a.createElement(ue.a,{onClick:n,color:"default"},"Cancel"),r.a.createElement(ue.a,{onClick:p,color:"secondary",id:"note-add-button"},"Add")))},ge=n(63),Ee=n.n(ge),be=n(85),he=n.n(be),ye=n(84),ve=n.n(ye),Oe=Object(m.a)((function(e){return{header:{padding:e.spacing(2,2,0,2),textAlign:"center"},count:{width:"50px",textAlign:"center"},content:{alignItems:"center",display:"flex",justifyContent:"center"},iconButton:{backgroundColor:e.palette.primary.light,color:"white",margin:e.spacing(0,1),"&:hover":{backgroundColor:e.palette.gray.main}},actions:{alignItems:"center",display:"flex",justifyContent:"space-between"}}})),ke=function(e,t,n){return Math.min(t,Math.max(e,n))},Ce=function(e){var t=e.isOpen,n=e.handleClose,l=Object(a.useState)(1),o=Object(g.a)(l,2),c=o[0],i=o[1],u=j().addNote,s=Oe();return r.a.createElement(re.a,{open:t,onClose:n,"aria-labelledby":"add-note-dialog-title"},r.a.createElement(le.a,{id:"add-note-dialog-title",className:s.header},"Generate Note"),r.a.createElement(ce.a,{className:s.content},r.a.createElement(I.a,{"aria-label":"Decrement",color:"primary",size:"small",className:s.iconButton,disabled:c<1,onClick:function(){return i(ke(0,10,c-1))}},r.a.createElement(ve.a,null)),r.a.createElement(B.a,{variant:"body1",className:s.count},c),r.a.createElement(I.a,{"aria-label":"Increment",color:"primary",size:"small",className:s.iconButton,disabled:c>9,onClick:function(){return i(ke(0,10,c+1))}},r.a.createElement(he.a,null))),r.a.createElement(oe.a,{className:s.actions},r.a.createElement(ue.a,{onClick:n,color:"default"},"Cancel"),r.a.createElement(ue.a,{onClick:function(){u(Array.from({length:c},(function(e,t){return t})).map((function(){return{id:Object(se.generate)(),title:Ee()({sentenceLowerBound:2,sentenceUpperBound:6}),content:Ee()({units:"paragraphs"})}}))),n()},color:"secondary"},"Generate")))},Ne=function(e){var t=e.titleElement,n=Object(a.useState)(!1),l=Object(g.a)(n,2),o=l[0],c=l[1],i=Object(a.useState)(!1),u=Object(g.a)(i,2),s=u[0],m=u[1],d=j(),f=d.saveNotes,p=d.loadNotes;return r.a.createElement(r.a.Fragment,null,r.a.createElement(ae,{top:t},r.a.createElement(K.a,{component:"nav"},r.a.createElement(V,{label:"Add Note",icon:r.a.createElement(D.a,null),onClick:function(){return c(!0)}}),r.a.createElement(V,{label:"Generate Note",icon:r.a.createElement(R.a,null),onClick:function(){return m(!0)}}),r.a.createElement(Q.a,null),r.a.createElement(V,{label:"Save All Notes",icon:r.a.createElement(J.a,null),onClick:function(){return f()}}),r.a.createElement(V,{label:"Load Notes",icon:r.a.createElement(H.a,null),onClick:function(){return p()}}))),r.a.createElement(pe,{isOpen:o,handleClose:function(){return c(!1)}}),r.a.createElement(Ce,{isOpen:s,handleClose:function(){return m(!1)}}))},je=Object(m.a)((function(e){return{title:{flexGrow:1,fontFamily:e.typography.headline,fontSize:"1.75rem"}}})),xe=function(){var e=je();return r.a.createElement(B.a,{variant:"h1",className:e.title},"Quick Notes")},we=function(){return r.a.createElement(F.a,{position:"sticky"},r.a.createElement(q.a,null,r.a.createElement(Ne,{titleElement:r.a.createElement(xe,null)}),r.a.createElement(xe,null)))},Se=Object(m.a)((function(){return{grid:{display:"grid",gap:"1rem",margin:"2rem auto",gridTemplateColumns:"repeat(auto-fill, minmax(15rem, 1fr))",gridTemplateRows:"repeat(auto-fill, minmax(15rem, 1fr))"}}})),Ie=function(){var e=j(),t=e.notes,n=e.removeNote,a=Se();return r.a.createElement(r.a.Fragment,null,r.a.createElement(we,null),r.a.createElement(d.a,{component:"main",fixed:!0},r.a.createElement("section",{className:a.grid},t.map((function(e){var t=e.id,n=e.title,a=e.content;return r.a.createElement(P,{key:t,id:t,title:n,content:a})})))),r.a.createElement(O,{menuItems:[{label:"Remove",onClickFunc:function(e){return n(e)}}]}))},Me=n(47),Te="Roboto, 'Helvetica Neue', Arial, sans-serif",Be={headline:Te,body:"Dosis, ".concat(Te)},Ae={red:{main:"#cd1717",light:"#e93d3d",dark:"#a20707",contrastText:"#fff"},green:{main:"#5cb35c",light:"#8fd28f",dark:"#349234",contrastText:"#fff"},blue:{main:"#36a1f4",light:"#8bc9f8",dark:"#047cd8",contrastText:"#fff"},gold:{main:"#fcb448",light:"#ffc46B",dark:"#ed991c",contrastText:"#fff"},gray:{main:"#ccc",light:"#eee",dark:"#aaa",contrastText:"#000"}},Pe=Object(Me.a)({palette:Object(E.a)({primary:Ae.blue,secondary:Ae.green,error:Ae.red,score:{low:Ae.green.light,medium:Ae.gold.main,high:Ae.red.dark},list:{header:Ae.gray.light,headerBorder:Ae.gray.dark},background:{paper:"#eee",default:"#fafafa"}},Ae),typography:{fontFamily:Te,htmlFontSize:16,headline:Be.headline,body:Be.body}}),Fe=Object(c.a)(Pe),qe=r.a.createElement(i.a,{theme:Fe},r.a.createElement(u.a,null),r.a.createElement(s.SnackbarProvider,{maxSnack:3,autoHideDuration:3e3,preventDuplicate:!0},r.a.createElement((function(e){var t=e.children,n=Object(a.useReducer)(h,b),l=Object(g.a)(n,2),o=l[0],c=l[1],i=Object(a.useMemo)((function(){return[o,c]}),[o]);return r.a.createElement(y.Provider,{value:i},t)}),null,r.a.createElement((function(e){var t=e.children,n=Object(a.useState)([]),l=Object(g.a)(n,2),o=l[0],c=l[1],i=Object(a.useMemo)((function(){return[o,c]}),[o]);return r.a.createElement(N.Provider,{value:i},t)}),null,r.a.createElement(Ie,null)))));o.a.render(qe,document.getElementById("app"))}},[[112,1,2]]]);
//# sourceMappingURL=main.667d970c.chunk.js.map