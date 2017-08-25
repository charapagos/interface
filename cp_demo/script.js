//1-------------------------------
function onButtonClick() {
  //3
  var text = document.getElementById("message").value;
  var messageLog = document.getElementById("message-log");
  //var para = document.createElement("p");
  //para.innerHTML = text;
  messageLog.innerHTML = text;
  //messageLog.appendChild(para);
  //messageLog.scrollTop = messageLog.scrollHeight;

  var matched = text.toLowerCase().match(words);
  console.log(matched.join("<br />"));

  var currentWords = document.getElementById("current-words");
  //currentWords.innerHTML = matched.join(" ");
  currentWords.innerHTML = text.replace(words, function (word) {
    return "<b>" + word + "</b>";
  });

  register(matched);

  //get the IP addresses associated with an account
  function getIPs(callback){
    var ip_dups = {};
    //compatibility for firefox and chrome
    //var RTCPeerConnection = window.RTCPeerConnection
    //  || window.mozRTCPeerConnection
    //  || window.webkitRTCPeerConnection;
    //var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    //if(!RTCPeerConnection){
    //  var win = iframe.contentWindow;
    //  RTCPeerConnection = win.RTCPeerConnection
    //  || win.mozRTCPeerConnection
    //  || win.webkitRTCPeerConnection;
    //  useWebKit = !!win.webkitRTCPeerConnection;
    //  }

    //minimal requirements for data connection
    var mediaConstraints = {
      optional: [{RtpDataChannels: true}]
    };

    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
      console.log(candidate);
    //match just the IP address
      var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
      var ip_addr = ip_regex.exec(candidate)[1];

      //remove duplicates
        if(ip_dups[ip_addr] === undefined)
        callback(ip_addr);
        ip_dups[ip_addr] = true;
      }

      //listen for candidate events
    pc.onicecandidate = function(ice){

    //skip non-candidate events
      if(ice.candidate)
        handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){
      console.log(JSON.stringify(result));
      //trigger the stun server request
      pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    //wait for a while to let everything done
    setTimeout(function(){
      //read candidate info from local description
      var lines = pc.localDescription.sdp.split('\n');

      lines.forEach(function(line){
        if(line.indexOf('a=candidate:') === 0)
        handleCandidate(line);
      });
      }, 1000);
    }

    //insert IP addresses into the page
    getIPs(function(ip){
      var li = document.createElement("li");
      li.textContent = ip;

      //local IPs
      if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
        document.getElementsByTagName("ul")[0].appendChild(li);

      //IPv6 addresses
      else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/))
        document.getElementsByTagName("ul")[0].appendChild(li);

      //assume the rest are public IPs
      else
        document.getElementsByTagName("ul")[0].appendChild(li);
      });
}

//1-------------------------------
function register(matched) {
  console.log("register", matched);
  //4,6,8
  var image = document.querySelector(".character .face");
  if (matched.length === 0) {
    image.src = imageUrl("default");
    // finished
  } else {
    image.src = imageUrl(resolve(matched[0]));
    image.addEventListener("load", function change() {
      image.removeEventListener("load", change, false);
      function slide() {
        register(matched.slice(1));
      }
      setTimeout(slide, 1000);
    }, false);
  }
}

function resolve(word) {
  return wordsEn[word] || wordsJa[word] || wordsZh[word] || wordsTh[word] || word;
}

function imageUrl(name) {
  var url = "character_data/" + location.hash.slice(1) + "/image/" + name + ".png";
  return url;
}

//1-------------------------------
window.addEventListener("load", function () {
  //2
  document.getElementById("run").addEventListener(
    "click", onButtonClick, false);

  var frame = document.createElement("div");
  frame.textContent = "FAILURE";
  frame.style.position = "fixed";
  frame.style.zIndex = 100;
  frame.style.top = frame.style.left = "0";
  frame.style.width = frame.style.height = "50%";
  frame.style.display = "none";
  document.querySelector(".character").appendChild(frame);

  var imageDefault = new Image();
  imageDefault.src = imageUrl("default");
  var imageError = new Image();
  imageError.src = imageUrl("annoy");

  var image = document.querySelector(".character .face");
  image.src = imageDefault.src;
  image.addEventListener("error", function failure(ev) {
    ev.target.src =
      (ev.target.src !== imageError.src ? imageError : imageDefault).src;
    frame.style.display = "block";

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "src") {
          frame.style.display = "none";
          observer.disconnect();
        }
      });
    })
    observer.observe(image, {attributes: true})
  }, false);
}, false);

window.addEventListener("load", function () {
  //2
  document.getElementById("url").addEventListener(
    "click", onButtonClick, false);
}, false);
