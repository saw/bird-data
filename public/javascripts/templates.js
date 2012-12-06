(function(){var a=Handlebars.template,b=Handlebars.templates=Handlebars.templates||{};Handlebars.partials=Handlebars.templates,b.birds=a(function(a,b,c,d,e){function m(a,b){var d="",e,f;return d+='\t\t<h1 class="title">',f=c.name,f?e=f.call(a,{hash:{}}):(e=a.name,e=typeof e===i?e():e),d+=j(e)+"</h1>\t\t",d}function n(a,b){var c="",d;return c+='\t\t\t<div class="navigation">\t\t\t\t<a href="',d=a.prev,d=d==null||d===!1?d:d.path,d=typeof d===i?d():d,c+=j(d)+'" title="',d=a.prev,d=d==null||d===!1?d:d.name,d=typeof d===i?d():d,c+=j(d)+'" \t\t\t\t\tclass="prev-link arrow">\t\t\t\t\t<span>◀</span>\t\t\t\t</a>\t\t\t\t<a href="',d=a.next,d=d==null||d===!1?d:d.path,d=typeof d===i?d():d,c+=j(d)+'" title="',d=a.next,d=d==null||d===!1?d:d.name,d=typeof d===i?d():d,c+=j(d)+'"  \t\t\t\t\tclass="next-link arrow">\t\t\t\t\t<span>▶</span>\t\t\t\t</a></div>\t\t\t',c}function o(a,b){var d="",e,f;return d+='\t\t\t<img class="hero-img" src="',f=c.url_z,f?e=f.call(a,{hash:{}}):(e=a.url_z,e=typeof e===i?e():e),d+=j(e)+'" alt="">\t\t\t',d}c=c||a.helpers;var f="",g,h,i="function",j=this.escapeExpression,k=this,l=c.blockHelperMissing;f+='<div class="slide">\t<div class="header">\t\t',h=c.words,h?g=h.call(b,{hash:{},inverse:k.noop,fn:k.program(1,m,e)}):(g=b.words,g=typeof g===i?g():g),c.words||(g=l.call(b,g,{hash:{},inverse:k.noop,fn:k.program(1,m,e)}));if(g||g===0)f+=g;f+='\t\t<div class="hero">',g=b.next,g=c["if"].call(b,g,{hash:{},inverse:k.noop,fn:k.program(3,n,e)});if(g||g===0)f+=g;f+="\t\t\t",h=c.photo,h?g=h.call(b,{hash:{},inverse:k.noop,fn:k.program(5,o,e)}):(g=b.photo,g=typeof g===i?g():g),c.photo||(g=l.call(b,g,{hash:{},inverse:k.noop,fn:k.program(5,o,e)}));if(g||g===0)f+=g;f+='\t\t</div>\t\t</div>\t<div class="bd">\t\t',g=b.words,g=g==null||g===!1?g:g.content,g=typeof g===i?g():g;if(g||g===0)f+=g;return f+="\t</div></div>",f}),b.hummingbirdss=a(function(a,b,c,d,e){function m(a,b){var d,e;return e=c.photo,e?d=e.call(a,{hash:{},inverse:k.noop,fn:k.program(2,n,b)}):(d=a.photo,d=typeof d===i?d():d),c.photo||(d=l.call(a,d,{hash:{},inverse:k.noop,fn:k.program(2,n,b)})),d||d===0?d:""}function n(a,b){var d="",e,f;return d+='\t\t<li>\t\t\t<a class="slidelink" href="http://www.flickr.com/photos/',f=c.pathalias,f?e=f.call(a,{hash:{}}):(e=a.pathalias,e=typeof e===i?e():e),d+=j(e)+"/",f=c.id,f?e=f.call(a,{hash:{}}):(e=a.id,e=typeof e===i?e():e),d+=j(e)+'">\t\t\t\t<img data-owner="',f=c.ownername,f?e=f.call(a,{hash:{}}):(e=a.ownername,e=typeof e===i?e():e),d+=j(e)+'" data-flickr-url="http://www.flickr.com/photos/',f=c.pathalias,f?e=f.call(a,{hash:{}}):(e=a.pathalias,e=typeof e===i?e():e),d+=j(e)+"/",f=c.id,f?e=f.call(a,{hash:{}}):(e=a.id,e=typeof e===i?e():e),d+=j(e)+'" alt="',f=c.title,f?e=f.call(a,{hash:{}}):(e=a.title,e=typeof e===i?e():e),d+=j(e)+'" data-full-height="',f=c.height_z,f?e=f.call(a,{hash:{}}):(e=a.height_z,e=typeof e===i?e():e),d+=j(e)+'" data-full-width="',f=c.width_z,f?e=f.call(a,{hash:{}}):(e=a.width_z,e=typeof e===i?e():e),d+=j(e)+'" src="',f=c.url_q,f?e=f.call(a,{hash:{}}):(e=a.url_q,e=typeof e===i?e():e),d+=j(e)+'" height="75" width="75">\t\t\t</a>\t\t</li>',d}c=c||a.helpers;var f="",g,h,i="function",j=this.escapeExpression,k=this,l=c.blockHelperMissing;f+='<div class="carousel">\t<ul>',h=c.birds,h?g=h.call(b,{hash:{},inverse:k.noop,fn:k.program(1,m,e)}):(g=b.birds,g=typeof g===i?g():g),c.birds||(g=l.call(b,g,{hash:{},inverse:k.noop,fn:k.program(1,m,e)}));if(g||g===0)f+=g;return f+="\t</ul></div>",f}),b.indexs=a(function(a,b,c,d,e){function m(a,b){var d="",e,f;return d+='\t<li><a href="',f=c.path,f?e=f.call(a,{hash:{}}):(e=a.path,e=typeof e===i?e():e),d+=j(e)+'">',f=c.name,f?e=f.call(a,{hash:{}}):(e=a.name,e=typeof e===i?e():e),d+=j(e)+" (",f=c.latin,f?e=f.call(a,{hash:{}}):(e=a.latin,e=typeof e===i?e():e),d+=j(e)+")</a></li>\t",d}c=c||a.helpers;var f="",g,h,i="function",j=this.escapeExpression,k=this,l=c.blockHelperMissing;f+='<h1>A guide to Birds!</h1><ol start="0">\t',h=c.birds,h?g=h.call(b,{hash:{},inverse:k.noop,fn:k.program(1,m,e)}):(g=b.birds,g=typeof g===i?g():g),c.birds||(g=l.call(b,g,{hash:{},inverse:k.noop,fn:k.program(1,m,e)}));if(g||g===0)f+=g;return f+="</ol>",f}),b.layouts=a(function(a,b,c,d,e){function m(a,b){var d="",e,f;d+="\tvar birdList = ",f=c.list,f?e=f.call(a,{hash:{}}):(e=a.list,e=typeof e===i?e():e);if(e||e===0)d+=e;return d+=";",d}function n(a,b){var c="";return c+='\tvar thisBird = "',a=typeof a===i?a():a,c+=j(a)+'";',c}c=c||a.helpers;var f="",g,h,i="function",j=this.escapeExpression,k=this,l=c.blockHelperMissing;f+='<!DOCTYPE HTML><html lang="en-us"><head>\t<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">\t<meta name="viewport" content="width=device-width">\t<title>Scroll</title>\t<link rel="stylesheet" type="text/css" href="/stylesheets/screen.css" media="all">\t<style type="text/css">\t</style></head><body>\t<div class="view">\t\t',h=c.body,h?g=h.call(b,{hash:{}}):(g=b.body,g=typeof g===i?g():g);if(g||g===0)f+=g;f+='\t</div></body><script type="text/javascript">',g=b.list,g=c["if"].call(b,g,{hash:{},inverse:k.noop,fn:k.program(1,m,e)});if(g||g===0)f+=g;h=c.id,h?g=h.call(b,{hash:{},inverse:k.noop,fn:k.program(3,n,e)}):(g=b.id,g=typeof g===i?g():g),c.id||(g=l.call(b,g,{hash:{},inverse:k.noop,fn:k.program(3,n,e)}));if(g||g===0)f+=g;return f+='</script><script type="text/javascript" src="/javascripts/handlebars.js"></script><script type="text/javascript" src="/javascripts/templates.js"></script><script type="text/javascript" src="/javascripts/router.js"></script><script type="text/javascript" src="/javascripts/model.js"></script><script type="text/javascript" src="/javascripts/bird-model.js"></script><script type="text/javascript" src="/javascripts/app.js"></script></html>',f})})()