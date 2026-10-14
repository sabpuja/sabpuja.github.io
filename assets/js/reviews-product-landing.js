(function () {
  'use strict';
  var sample = [
    {id:1,topic:'Packaging',rating:5,title:'Neat, compact and easy to keep near the mandir',body:'Everything feels organized instead of scattered in different drawers. The presentation is what I liked most.'},
    {id:2,topic:'Festival preparation',rating:5,title:'Helpful for festival preparation',body:'I wanted the small essentials organized before the festival instead of buying everything separately. This format makes preparation much easier.'},
    {id:3,topic:'Gifting',rating:5,title:'Gift-friendly presentation',body:'The organized presentation made it feel thoughtful without being overdone. It looked clean and practical.'},
    {id:4,topic:'Ease of use',rating:4,title:'Good concept and easy to understand',body:'The kit format is convenient and the contents are easy to scan. I would love refill options later as well.'},
    {id:5,topic:'Packaging',rating:5,title:'Clean and practical',body:'I liked that the presentation feels devotional but still clean and modern. The packaging is easy to keep organized.'},
    {id:6,topic:'Festival preparation',rating:5,title:'A helpful starting point',body:'Simple, well arranged and easy for everyone at home to understand before preparation begins.'}
  ];
  var state = {mode:'example',product:'Navratri Puja Kit',topic:'All',sort:'featured',expanded:false};
  var mount = document.getElementById('rrMount');
  var flag = document.getElementById('rrFlag');
  var modal = document.getElementById('rrModal');
  var closeButton = document.getElementById('rrModalClose');
  var lastMedia = null;
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function mailLink(){return 'mailto:support@sabpuja.com?subject='+encodeURIComponent('Product review: '+state.product);}
  function side(){
    if(state.mode==='safe'){
      return '<aside class="rr-summary"><span class="rr-summary__eyebrow">Product feedback</span><h3 class="rr-section-title" style="margin-top:17px">Your experience matters.</h3><p class="rr-small">Product-specific star ratings and customer stories will appear here when approved reviews are connected.</p><div class="rr-divider"></div><p class="rr-asideheading">What customers can share</p><ul class="rr-side-list"><li>Packaging and presentation</li><li>How the kit helped prepare</li><li>Product quality and usability</li></ul></aside>';
    }
    var percentages=[93,5,1,1,0];
    var bars=percentages.map(function(p,i){return '<div class="rr-bar"><span>'+(5-i)+' star</span><div class="rr-track"><span class="rr-fill" style="width:'+p+'%"></span></div><span>'+p+'%</span></div>';}).join('');
    return '<aside class="rr-summary"><span class="rr-summary__eyebrow">Sample overall rating</span><div class="rr-average">4.9</div><div class="rr-stars" aria-label="Five illustrative stars">★★★★★</div><p class="rr-rating-caption">128 sample ratings · not actual reviews</p><div class="rr-bars" aria-label="Illustrative rating distribution">'+bars+'</div><div class="rr-divider"></div><p class="rr-asideheading">Review this product</p><p class="rr-small">Share your experience with other Sabpuja customers.</p><a class="rr-btn rr-btn--line" href="'+escapeHtml(mailLink())+'">Write a product review ↗</a><div class="rr-divider"></div><p class="rr-asideheading">What shoppers find useful</p><ul class="rr-side-list"><li>Packaging and presentation</li><li>Festival preparation</li><li>Gifting and ease of use</li></ul></aside>';
  }
  function filtered(){
    var list=sample.filter(function(r){return state.topic==='All'||r.topic===state.topic;});
    if(state.sort==='highest')list.sort(function(a,b){return b.rating-a.rating||a.id-b.id;});
    if(state.sort==='recent')list.sort(function(a,b){return b.id-a.id;});
    return list;
  }
  function reviewCard(r){
    return '<article class="rr-review"><div class="rr-reviewhead"><div class="rr-person"><span class="rr-avatar" aria-hidden="true">'+String(r.id).padStart(2,'0')+'</span><span>Example review '+String(r.id).padStart(2,'0')+'</span></div><span class="rr-rating" aria-label="'+r.rating+' sample stars">'+('★'.repeat(r.rating))+'</span></div><h4>'+escapeHtml(r.title)+'</h4><p>'+escapeHtml(r.body)+'</p><div class="rr-reviewfoot"><span class="rr-topic-tag">'+escapeHtml(r.topic)+'</span><span class="rr-example-tag">Illustrative copy · not a verified customer</span></div></article>';
  }
  function render(){
    document.getElementById('rrSubtitle').textContent='Product-specific reviews and experiences for '+state.product+'.';
    document.getElementById('rrWrite').href=mailLink();
    flag.textContent=state.mode==='example'?'DESIGN SAMPLE ONLY. All metrics, quotes and media tiles are illustrative placeholders, not real customer evidence. Do not publish.':'PRODUCTION-SAFE PREVIEW. No approved product-linked review records are connected. Nothing is invented or carried over from another product.';
    document.querySelectorAll('[data-rr-mode]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-rr-mode')===state.mode?'true':'false');});
    if(state.mode==='safe'){
      mount.innerHTML=side()+'<div class="rr-content"><h3 class="rr-section-title">Reviews for '+escapeHtml(state.product)+'</h3><div class="rr-empty"><div class="rr-empty-icon" aria-hidden="true">✧</div><h3>Be among the first to share.</h3><p>Once authentic product-specific reviews are approved, they will appear here. Your experience can help others prepare with confidence.</p><a class="rr-btn" href="'+escapeHtml(mailLink())+'">Share your experience ↗</a></div></div>';
      return;
    }
    var topics=['All','Festival preparation','Packaging','Gifting','Ease of use'];
    var chips=topics.map(function(t){return '<button class="rr-topic" type="button" data-topic="'+escapeHtml(t)+'" aria-pressed="'+(state.topic===t?'true':'false')+'">'+escapeHtml(t)+'</button>';}).join('');
    var media=Array.from({length:6},function(_,i){return '<button class="rr-media" type="button" data-media="'+(i+1)+'" aria-label="Open sample media tile '+(i+1)+'"><span>Sample '+String(i+1).padStart(2,'0')+'</span></button>';}).join('');
    var records=filtered();
    var shown=state.expanded?records:records.slice(0,3);
    var more=records.length>3?'<button class="rr-more" type="button" data-more>'+ (state.expanded?'Show fewer reviews':'See more reviews ('+(records.length-3)+')')+'</button>':'';
    var sort='<label for="rrSort">Sort sample reviews: </label><select id="rrSort"><option value="featured"'+(state.sort==='featured'?' selected':'')+'>Featured</option><option value="recent"'+(state.sort==='recent'?' selected':'')+'>Newest sample first</option><option value="highest"'+(state.sort==='highest'?' selected':'')+'>Highest rating</option></select>';
    mount.innerHTML=side()+'<div class="rr-content"><div class="rr-title-row"><h3 class="rr-section-title">Customers say</h3><span class="rr-meta">Illustrative themes only</span></div><div class="rr-topics" aria-label="Filter sample reviews by topic">'+chips+'</div><div class="rr-title-row"><h3 class="rr-section-title">Reviews with images</h3><span class="rr-meta">Tap a sample tile</span></div><div class="rr-media-grid">'+media+'</div><div class="rr-filterbar"><span class="rr-meta">'+records.length+' sample review'+(records.length===1?'':'s')+'</span><div>'+sort+'</div></div><div class="rr-reviews">'+shown.map(reviewCard).join('')+'</div>'+more+'</div>';
  }
  document.querySelectorAll('[data-rr-mode]').forEach(function(button){button.addEventListener('click',function(){state.mode=button.getAttribute('data-rr-mode');state.topic='All';state.expanded=false;render();});});
  document.getElementById('rrProduct').addEventListener('change',function(e){state.product=e.target.value;state.topic='All';state.expanded=false;render();});
  mount.addEventListener('click',function(e){
    var topic=e.target.closest('[data-topic]');
    if(topic){state.topic=topic.getAttribute('data-topic');state.expanded=false;render();return;}
    if(e.target.closest('[data-more]')){state.expanded=!state.expanded;render();return;}
    var media=e.target.closest('[data-media]');
    if(media){lastMedia=media;document.getElementById('rrModalVisual').textContent='SAMPLE MEDIA '+media.getAttribute('data-media');modal.hidden=false;closeButton.focus();}
  });
  mount.addEventListener('change',function(e){if(e.target.id==='rrSort'){state.sort=e.target.value;render();}});
  function closeModal(){modal.hidden=true;if(lastMedia&&document.contains(lastMedia))lastMedia.focus();}
  closeButton.addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)closeModal();if(e.key==='Tab'&&!modal.hidden){e.preventDefault();closeButton.focus();}});
  render();
}());
