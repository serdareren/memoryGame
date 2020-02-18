/* global TweenMax, SteppedEase, Sine, Bounce, Power0, Tweenmax */
// Utility functions //
function shuffle(array) {
  var counter = array.length;
  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);
    counter--;
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
function randomBoolean() {
  return Math.random() < 0.5;
}
function deletingArray(x, y, z) {
  x.pop();
  y.pop();
  z.pop();
}
// Game Class //
function MemoryGame(maxNum) {
  this.maxNum = maxNum;
  this.boxes = [];
  this.choices = [];
  this.count = 0;
  this.asdasd = 0;
  this.clicks = [];
  this.openSound = new Audio('Sound/open3.wav');
  this.closeSound = new Audio('Sound/close2.wav');
  this.initialize();
}
MemoryGame.prototype = {
  initialize: function () {
    this.createBoxElements();
    this.createQuestions();
    this.fillBoxes();
    this.start();
  },
  createBoxElements: function () {
    var container = $("#boxes");
    for (var i = 0; i < 16; ++i) {
      var boxElem = $("<div/>");
      boxElem.attr("id", "box_" + i);
      boxElem.addClass("box");
      boxElem.attr("data-index", i);

      var closedElem = $("<div/>");
      closedElem.addClass("closed");

      var openElem = $("<div/>");
      openElem.addClass("open");

      boxElem.append(closedElem);
      boxElem.append(openElem);
      container.append(boxElem);

      this.boxes.push(boxElem);
    }
  },
  createQuestions: function () {
    var answers = [];

    for (var i = 0; i < 8; i++) {
      var question;
      var answerValue;
      var existingIndex;

      do {
        question = this.getRandomQuestion();
        answerValue = question.value;
        existingIndex = answers.indexOf(answerValue);
      } while (existingIndex >= 0);

      var answer = {type: "A", value: answerValue};
      answers.push(answerValue);

      this.choices.push(question);
      this.choices.push(answer);
    }
    shuffle(this.choices);
  },
  getRandomQuestion: function () {
//    var op;
//    if(randomBoolean()){
//      op = "+";
//    } else {
//      op = "-";
//    }
    var op = randomBoolean() ? "+" : "-";
    var num1 = randomInt(0, this.maxNum);
    var num2 = randomInt(0, this.maxNum);
    if (op === "-" && num1 < num2) {
      var temp = num1;
      num1 = num2;
      num2 = temp;
    }
    var answer = (op === "-") ? (num1 - num2) : (num1 + num2);
    var text = (op === "-") ? (num1 + "-" + num2) : (num1 + "+" + num2);
    return {type: "Q", text: text, value: answer};
  },
  fillBoxes: function () {
    for (var i = 0; i < this.choices.length; i++) {
      var choice = this.choices[i];
      var displayText;
      if (choice.type === "Q") {
        displayText = choice.text;
      } else {
        displayText = "" + choice.value;
      }
      this.boxes[i].find(".open").html(displayText);

    }
  },
  openBox: function (index) {
    var boxElem = this.boxes[index];
    var closedElem = boxElem.find(".closed");
    var openElem = boxElem.find(".open");
    var tl = new TimelineMax();
    tl.fromTo(closedElem, 0.25, {rotationY: 0}, {rotationY: 90, ease: Power0.easeNone, onStart: addClass, onComplete: show});
    tl.fromTo(openElem, 0.25, {delay: 0.5, rotationY: 90}, {rotationY: 0, ease: Power0.easeNone});
    this.openSound.play();
    function addClass() {
      boxElem.addClass("selected");
    }

    function show()
    {
      openElem.show();
      closedElem.hide();
    }

    return tl;
  },
  closeBox: function (index) {
    var boxElem = this.boxes[index];
    var closedElem = boxElem.find(".closed");
    var openElem = boxElem.find(".open");
    var tl = new TimelineMax();
    tl.fromTo(openElem, 0.25, {rotationY: 0}, {rotationY: 90, ease: Power0.easeNone, onComplete: show});
    tl.fromTo(closedElem, 0.25, {delay: 0.5, rotationY: 90}, {rotationY: 0, ease: Power0.easeNone, onComplete: removeClass});

    function removeClass() {
      boxElem.removeClass("selected");
    }

    function show()
    {
      openElem.hide();
      closedElem.show();
    }

    return tl;
  },
  moveLeft: function (index) {
    var boxElem = this.boxes[index];
    var attach = $("#equation");
    var attachTop = attach.offset().top;
    var attachLeft = attach.offset().left;
    var ofTop = boxElem.offset().top;
    var ofLeft = boxElem.offset().left;

    //setTimeout(function(){ moveSound.play();},800);
    return TweenMax.to(boxElem, 0.5, {x: attachLeft - ofLeft, y: attachTop - ofTop, scale: 0.6/*, onComplete: del*/});

  },
  moveRight: function (index) {
    var boxElem = this.boxes[index];
    var attach = $("#answer");
    var att = $("#attach");
    var attachTop = attach.offset().top;
    var attachLeft = attach.offset().left;
    var ofTop = boxElem.offset().top;
    var ofLeft = boxElem.offset().left;
    var yesSound = new Audio('Sound/yes.mp3');

    return TweenMax.to(boxElem, 0.5, {x: attachLeft - ofLeft, y: attachTop - ofTop, scale: 0.6, onComplete: del});


    function del() {
      att.show();
      new TweenMax.fromTo("#attach", 0.5, {opacity: 0, x: 110, scale: 1}, {opacity: 1, x: 0, scale: 1});
      yesSound.play();
    }
  },
  playAnimation: function () {
    var mpr = new TimelineMax({repeat: -1});
    return mpr
            .set("#play", {y: 0})
            .fromTo("#play", 1.5, {rotation: -5, scale: 1, x: 0}, {rotation: 5, scale: 1.1, ease: Sine.easeOut, x: -9, delay: 0.2})
            .fromTo("#play", 1.5, {rotation: 5, scale: 1.1, x: -9}, {rotation: -5, scale: 1, x: 0});
  },
  wormAnim: function () {
    var biteSound = new Audio('Sound/bite.mp3');
    var wormSound = new Audio('Sound/worm.mp3');
    var wonSound = new Audio('Sound/won.wav');
    var worm = $("#worm");
    //var ns = this.playAnimation();
    wormSound.loop = true;
    wormSound.play();
    var wormAnimation = TweenMax.to(worm, 1.7, {repeat: 7, backgroundPositionX: "404px", ease: SteppedEase.config(4)});
    wormAnimation.timeScale(2);

    var wormWalk = new TimelineMax({onComplete: appleAnim});
    wormWalk.to("#worm", 6, {x: -260}, 0);

    function appleAnim() {
      worm.hide();
      var apple = $("#apple");
      var play = $("#play");
      wormSound.pause();
      biteSound.play();
      var appleAnimat = TweenMax.to(apple, 3, {repeat: 0, backgroundPositionX: "-600px", ease: SteppedEase.config(6), onComplete: wonAnim});
      appleAnimat.timeScale(2);

      function wonAnim() {
        wonSound.play();
        setTimeout(playa);
      }
      function playa() {
        play.show();
        new TweenMax.fromTo("#play", 1, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, onComplete: playHover});

        function playHover() {
          $("#play").hover(function () {
            TweenMax.set("#play", {scale: 1.02});
          }, function () {
            TweenMax.set("#play", {scale: 1});
          });
        }
      }
    }


  },
  zIndex: function (index0, index1, cnt) {
    var boxElem = this.boxes[index0];
    var boxElem1 = this.boxes[index1];

    for (var x = 0; x <= cnt; x++) {
      boxElem.css("z-index", "5" + x);
      boxElem1.css("z-index", "5" + x);
    }
  },
  anims: function () {
    new TweenMax.to("#restart", 0.5, {opacity: 0, y: 0, scale: 0.5, delay: 2.8});
    new TweenMax.to("#boxes", 0.5, {opacity: 0, y: 0, scale: 0.5, delay: 2.8, onComplete: hideGame});
    new TweenMax.to("#attach", 0.5, {opacity: 0, scale: 0.5, delay: 2.8});
    new TweenMax.to("#apple", 0.5, {opacity: 0, y: 0, scale: 0.5, delay: 2.8, onComplete: fin1});
    new TweenMax.to("#score",0.5,{opacity:0,x:0, y:0,rotation:0,delay:2.8});
    new TweenMax.to("#play", 0.5, {opacity:0,rotation:8,delay:2.8});

    var papSound = new Audio('Sound/pap.mp3');
    var papSound1 = new Audio('Sound/pap.mp3');
    var papSound2 = new Audio('Sound/pap.mp3');
    var papSound3 = new Audio('Sound/pap.mp3');
    var papSound4 = new Audio('Sound/pap.mp3');
    var finishSound = new Audio('Sound/finish.mp3');

    new TweenMax.fromTo("#fin1", 1, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 3.5, onComplete: fin2});
    new TweenMax.fromTo("#fin2", 1.4, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 3.8, onComplete: fin3});
    new TweenMax.fromTo("#fin3", 1.4, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 4, onComplete: fin5});
    new TweenMax.fromTo("#fin5", 1.4, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 4.2, onComplete: fin6});
    new TweenMax.fromTo("#fin6", 1.4, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 4.4, onComplete: fin7});
    new TweenMax.fromTo("#fin7", 1.4, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 4.6, onComplete: fin4});
    new TweenMax.fromTo("#fin4", 1.4, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 4.8, onComplete: fin9});
    new TweenMax.fromTo("#fin9", 1.8, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 5.7, onComplete: fin10});
    new TweenMax.fromTo("#fin10", 2, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 5.8, onComplete: fin11});
    new TweenMax.fromTo("#fin11", 2, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 6, onComplete: fin8});
    new TweenMax.fromTo("#fin8", 3, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 6.2, onComplete: fin12});
    new TweenMax.fromTo("#again", 3, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 0.8, delay: 6.4, onComplete: fin13});

    function hideGame() {
      $("#boxes").hide();
    }
    function fin1() {
      $("#fin1").show();
      papSound.play();
    }
    function fin2() {
      $("#fin2").show();
      papSound.play();
    }
    function fin3() {
      $("#fin3").show();
      papSound.play();
    }
    function fin4() {
      $("#fin4").show();
      papSound1.play();
    }
    function fin5() {
      $("#fin5").show();
      papSound2.play();
    }
    function fin6() {
      $("#fin6").show();
      papSound3.play();
    }
    function fin7() {
      $("#fin7").show();
      papSound4.play();
    }
    function fin8() {
      $("#fin8").show();
      //papSound.play();
      finishSound.play();
    }
    function fin9() {
      $("#fin9").show();
      papSound.play();
    }
    function fin10() {
      $("#fin10").show();
      papSound.play();
      new TweenMax.fromTo("#play",1,{opacity:0,x:-12,y:126,scale:0.5},{opacity:1,scale:1});
      new TweenMax.fromTo("#score",1,{opacity:0,x:-409,y:213,scale:0.5},{opacity:1,scale:1});
    }
    function fin11() {
      $("#fin11").show();
      papSound.play();
    }
    function fin12() {
      $("#again").show();
    }
    function fin13() {
      $("#again").hover(function () {
        TweenMax.set("#again", {scale: 0.7});
      }, function () {
        TweenMax.set("#again", {scale: 0.8});
      });
    }
    $("#again").click($.proxy(function () {
      this.playAgain();
      this.createBoxElements();
      this.createQuestions();
      this.fillBoxes();
      this.reStart();
    }, this));
  },
  start: function () {
    var na = this.wormAnim();

    var press = false;
    var cn = 0;
    var cnt = 0;
    var asd = $("#attach");
    asd.hide();

    $("#restart").click($.proxy(function () {
      this.deletes();
      this.createBoxElements();
      this.createQuestions();
      this.fillBoxes();
      this.reStart();
      new TweenMax.fromTo("#restart", 0.5, {opacity: 1, y: 0, rotation: -360, scale: 1}, {opacity: 1, y: 0, rotation: 360, scale: 1});
    }, this));

    $("#play").click(function () {

      var game = $("#game");
      var rest = $("#restart");
      game.show();
      rest.show();

      new TweenMax.to("#play", 0.7, {x: 400, y: -150, opacity:0, scale: 0.5, onComplete: function () {
          $("#play").attr("src", "Img/hamle.png");
          new TweenMax.fromTo("#play",0.5, {opacity:0},{opacity:1,scale:1,delay:0.3, y:-84,onComplete:function(){$("#score").show();}});
          $("#play").off("click");
        }});

      press = true;
      cn++;
      if (cn === 1) {
        new TweenMax.fromTo("#boxes", 1, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1, delay: 0.2});
        new TweenMax.fromTo("#restart", 0.5, {opacity: 0, y: 0, rotation: -360, scale: 0.5}, {opacity: 1, y: 0, rotation: 360, scale: 1, delay: 0.2, onComplete: restartHover});

        function restartHover() {
          $("#restart").hover(function () {
            TweenMax.set("#restart", {scale: 1.02});
          }, function () {
            TweenMax.set("#restart", {scale: 1});
          });
        }
      }

    });
    $(".box").on("click", $.proxy(function (e) {
      var elem = $(e.currentTarget);
      if (!press) {
        return;
      }
      if (elem.hasClass("selected")) {
        return;
      }
      this.count++;

      var index = parseInt(elem.attr("data-index"));
      var choice = this.choices[index];
      var type = this.choices[type];
      this.clicks.push({choice: choice, index: index});

      var openBoxAnim = this.openBox(index);

      if (this.count === 2) {
        var startTime = openBoxAnim.duration() + 0.5;
        var mainTimeline = new TimelineMax();
        mainTimeline.add(openBoxAnim);

        if (this.clicks[0].choice.value === this.clicks[1].choice.value) {

          if (this.clicks[0].choice.type === "A") {
            mainTimeline.add(this.moveRight(this.clicks[0].index), startTime);
          }
          if (this.clicks[1].choice.type === "A") {
            mainTimeline.add(this.moveRight(this.clicks[1].index), startTime);
          }
          if (this.clicks[0].choice.type === "Q") {
            mainTimeline.add(this.moveLeft(this.clicks[0].index), startTime);
          }
          if (this.clicks[1].choice.type === "Q") {
            mainTimeline.add(this.moveLeft(this.clicks[1].index), startTime);
          }
          var index0 = this.clicks[0].index;
          var index1 = this.clicks[1].index;

          cnt++;
          //console.log(cnt); 
          this.zIndex(index0, index1, cnt);

        } else {

          this.asdasd++;
          $("#score").html("Hamle :" + this.asdasd);
          console.log(this.asdasd);
          var close = this.closeSound;
          var closeBoxAnim0 = this.closeBox(this.clicks[0].index);
          var closeBoxAnim1 = this.closeBox(this.clicks[1].index);

          press = false;
          mainTimeline.add(closeBoxAnim0, startTime);
          mainTimeline.add(closeBoxAnim1, startTime);
          setTimeout(active, 1000);

          setTimeout(function () {
            close.play();
          }, 1000);
        }

        console.log(press);
        this.clicks = [];
        this.count = 0;

        if (cnt === 8) {
          var ani = this.anims();
        }
      }
      function active() {
        press = true;
      }
    }, this));
  },
  reStart: function () {
    var cnt = 0;
    var asd = $("#attach");
    asd.hide();
    press = true;
    $("#boxes").show();

    new TweenMax.fromTo("#boxes", 1, {opacity: 0, y: 0, scale: 0.5}, {opacity: 1, y: 0, scale: 1});
    $("#restart").click($.proxy(function () {
      this.deletes();
      this.createBoxElements();
      this.createQuestions();
      this.fillBoxes();
      this.reStart();
      new TweenMax.fromTo("#restart", 0.5, {opacity: 1, y: 0, rotation: -360, scale: 1}, {opacity: 1, y: 0, rotation: 360, scale: 1});
    }, this));

    $(".box").on("click", $.proxy(function (e) {
      var elem = $(e.currentTarget);
      if (!press) {
        return;
      }

      if (elem.hasClass("selected")) {
        return;
      }
      this.count++;

      var index = parseInt(elem.attr("data-index"));
      var choice = this.choices[index];
      var type = this.choices[type];
      this.clicks.push({choice: choice, index: index});

      var openBoxAnim = this.openBox(index);

      if (this.count === 2) {
        var startTime = openBoxAnim.duration() + 0.5;
        var mainTimeline = new TimelineMax();
        mainTimeline.add(openBoxAnim);

        if (this.clicks[0].choice.value === this.clicks[1].choice.value) {

          if (this.clicks[0].choice.type === "A") {
            mainTimeline.add(this.moveRight(this.clicks[0].index), startTime);
          }
          if (this.clicks[1].choice.type === "A") {
            mainTimeline.add(this.moveRight(this.clicks[1].index), startTime);
          }
          if (this.clicks[0].choice.type === "Q") {
            mainTimeline.add(this.moveLeft(this.clicks[0].index), startTime);
          }
          if (this.clicks[1].choice.type === "Q") {
            mainTimeline.add(this.moveLeft(this.clicks[1].index), startTime);
          }
          var index0 = this.clicks[0].index;
          var index1 = this.clicks[1].index;

          cnt++;
          this.zIndex(index0, index1, cnt);

        } else {
         
          this.asdasd++;
          $("#score").html("Hamle :" + this.asdasd);
          console.log(this.asdasd);

          var close = this.closeSound;
          var closeBoxAnim0 = this.closeBox(this.clicks[0].index);
          var closeBoxAnim1 = this.closeBox(this.clicks[1].index);
          press = false;
          mainTimeline.add(closeBoxAnim0, startTime);
          mainTimeline.add(closeBoxAnim1, startTime);
          setTimeout(active, 1000);

          setTimeout(function () {
            close.play();
          }, 1000);
        }

        this.clicks = [];
        this.count = 0;

        if (cnt === 8) {

          var ani = this.anims();

        }
      }
      function active() {
        press = true;
      }
    }, this));
  },
  deletes: function () {

    for (var i = 0; i < this.boxes.length; i++) {
      this.boxes[i].remove();
    }
    this.boxes = [];
    this.choices = [];
    this.count = 0;
    this.asdasd = 0;
    this.clicks = [];
    $("#attach").hide();
    $("#restart").off("click");
    $("#score").html("Hamle: 0");
    this.asdasd=0;
    //$("#play").off("click");
  },
  playAgain: function () {

    for (var i = 0; i < this.boxes.length; i++) {
      this.boxes[i].remove();
    }
    this.boxes = [];
    this.choices = [];
    this.count = 0;
    this.clicks = [];
    $("#fin1").hide();
    $("#fin2").hide();
    $("#fin3").hide();
    $("#fin4").hide();
    $("#fin5").hide();
    $("#fin6").hide();
    $("#fin7").hide();
    $("#fin8").hide();
    $("#fin9").hide();
    $("#fin10").hide();
    $("#fin11").hide();
    $("#again").hide();
    new TweenMax.to("#restart", 0.5, {opacity: 1, rotation: -360, scale: 1});
    new TweenMax.to("#play", 0.5, {x:400,y:-84,rotation:0});
    new TweenMax.to("#score", 0.5, {x:0,y:0,rotation:-8});
    new TweenMax.to("#apple", 0.5, {opacity: 1, scale: 1});
    $("#again").off("click");
    $("#play").off("click");
    $("#score").html("Hamle: 0");
    this.asdasd=0;
  }
};
var G;
$(document).ready(function () {
  G = new MemoryGame(10);
});