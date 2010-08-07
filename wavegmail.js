function sort(b,fn){
	return [].slice.call(b,0).sort(function(a,b){
		return fn(b)-fn(a)
	})
}


var unread = '<tr class="zA zE"><td class="oZ-x3 xY"><img class="oZ-jd" src="images/cleardot.gif" alt="" style=""><input class="oZ-jc" type="checkbox" aria-labelledby=""></td><td class="y4 xY"><img class="zG" src="images/cleardot.gif" alt=""></td><td class="yX xY"><div class="yW"><span class="zF" email="$email">$name</span> ($messages)</div></td><td class="xY"></td><td tabindex="0" role="link" class="xY"><div class="xS"><div class="xT"><div class="y6"><span><b>$title</b></span>‎<span class="y2">&nbsp;-&nbsp;$snippet</span></div></div></div></td><td class="yf xY">&nbsp;</td><td class="xW xY"><span title="$longdate"><b>$shortdate</b></span></td></tr>';
/*
  email
  name
  title
  snippet
  longdate
  shortdate
  messages //blipcount
*/
var read = '<tr class="zA yO"><td class="oZ-x3 xY" style=""><img class="oZ-jd" src="images/cleardot.gif" alt="" style=""><input class="oZ-jc" type="checkbox" aria-labelledby=""></td><td class="y4 xY"><img class="zG" src="images/cleardot.gif" alt=""></td><td class="yX xY"><div class="yW"><span class="yP" email="$email">$name</span> ($messages)</div></td><td class="xY"></td><td tabindex="0" role="link" class="xY"><div class="xS"><div class="xT"><div class="y6"><span>$title</span>‎<span class="y2">&nbsp;-&nbsp;$snippet</span></div></div></div></td><td class="yf xY">&nbsp;</td><td class="xW xY"><span title=$longdate">$shortdate</span></td></tr>';

var tables = sort(frames,function(a){return a.document.querySelectorAll('table').length})[0];
var table = sort(tables.document.querySelectorAll('table'), function(a){return a.scrollWidth})[0];
var entries = [];
for(var rows = table.querySelectorAll('tr'), l = rows.length; l--;){
	var spans = rows[l].querySelectorAll('span');
	var time = new Date(spans[spans.length-1].title.replace(/at |,/g,''));
	entries.push({date: time.getTime(), el: rows[l]})
}
for(var results = wave[0].data.searchResults.digests, l = results.length; l--;){
	var time = results[l].lastModified;
	
	var result = results[l];
	
	var date = new Date();
	date.setTime(result.lastModified);
	var dre = /(\w+) (\w+) 0*(\d+) (\d+) (\d+:\d+):\d+.*$/;
	var readable = date.toString().replace(dre,'$1, $2 $3, $4 at $5');
	var mini = date.toString().replace(dre, '$5');
	
	var template = {
	  name: '~'+/*squiggle denotes wave*/result.participants[0].replace(/@.+$/,'').replace(/^\w/,function(a){return a.toUpperCase()}),
	  email: result.participants[0],
	  title: result.title,
	  snippet: result.snippet,
	  shortdate: mini,
	  longdate: readable,
	  messages: result.blipCount
	};
	var par = document.createElement('div');
	par.innerHTML = (result.unreadCount > 0?unread:read).replace(/\$([a-z]+)/g, function(all, attr){
	  return template[attr];
	});
	var el = par.getElementsByTagName('tr')[0]
	
	
	
	
	
	entries.push({date: result.lastModified, el: el, wave: true, title: result.title})
}

var sorted_entries = entries.sort(function(a,b){
	return a.date - b.date;
})

var nwave = null;
for(var i = sorted_entries.length; i--;){
	var e = sorted_entries[i];
	console.log(e.title)
	if(!e.wave){
//		console.log('got nwave', e.el, e.el.parentNode)
		nwave = e.el;
	}else if(e.wave && nwave){
		//console.log('yaaaay')
		nwave.parentNode.insertBefore(e.el, nwave.nextSibling);
		nwave = e.el;
	}else if(e.wave && !nwave){
		rows[0].parentNode.insertBefore(e.el, rows[0])
	}
}
