//
// AnimatedEntity
//
// by Edgar Armenta Espinosa
// based on 'Killian.js' by Adam Roth
// modified from https://github.com/aroth/phaser-extend-sprite-statemachine-example

AnimatedEntity = function (game, x, y, anim_data) {
  // AnimatedEntity is an extension of Phaser.Sprite
  // 'this.anim_data.name' = 'killian', it is the id for the sprite atlas loaded at 'game.preload'
  // this = AnimatedEntity (object)
	
  this.atlas_name = anim_data.name;
  // SpriteAtlas
  // -----------
  // There is no technical advantage of using a sprite sheet at all. They tend to use more space 
  // both in memory and bandwidth because they don't pack frame data as efficiently as a texture atlas does.
  // However, there are lots of legacy graphics out there in that format, and its still quite popular today. 
  // So we support them. But you should try and pack graphics into atlases where possible to save on ram.
  // -Richard Davey

  // ---------------------------------------------------
  // Constructor
  // ---------------------------------------------------
  //  We call the Phaser.Sprite constructor
  Phaser.Sprite.call(this, game, x, y, this.atlas_name);

  // -------------------
  // The 'this' Keyword
  // -------------------
  // In JavaScript, the thing called 'this', is the object that "owns" the JavaScript code.
  // The value of 'this', when used in a function, is the object that "owns" the function.
  // The value of 'this', when used in an object, is the object itself.
  // The 'this' keyword in an object constructor does not have a value. It is only a substitute for the new object.
  // The value of 'this' will become the new object when the constructor is used to create an object.
  // NOTE: Note that 'this' is not a variable. It is a keyword. You cannot change the value of 'this'.

  // ---------------------------------------------------
  // State Machine
  // ---------------------------------------------------

  this.sm = new StateMachine( this, { debug: false } );
  var self = this;
  
  // ---------------------------------------------------
  // Create Animations, States & Transitions
  // ---------------------------------------------------
  
  // Loop through all the animations contained in the data retrieved from file at 'game.preload'
  // and create the animations and the state machine's states & transitions
  // ----------
  // IMPORTANT!
  // ----------
  // We must make sure to define in the file all the states first and then all the transitions
  // otherwise we'll get an error when a transition calls a state that hasn't been declared
  anim_data.animations.forEach(function (animation) {

      // ---------------------------------------------------
      // Animations
      // ---------------------------------------------------
	  this.animations.add(animation.name, animation.frames, animation.frameRate, animation.loop);

      // ---------------------------------------------------
      // State Machine States
      // ---------------------------------------------------
	  if (animation.type == "state")
	  {
		  // create an empty object that will hold all the events for this state
		  var state_events = {}

		  // loop through all the events defined in the file and add them to the object created above
		  animation.events.forEach(function (event) {
			  // turn the string in the file into runnable code
			  eval("var func = " + event.predicate + ";");

			  // add this individual event to the object containing all the events for this state
			  state_events[event.name] = func;
		  }, this);

		  // add this state to the state machine
		  this.sm.state(animation.name, state_events);   
	  } // end if state

      // ---------------------------------------------------
      // State Machine Transitions
      // ---------------------------------------------------
	  if (animation.type == "transition")
	  {
		  // turn the string in the file into runnable code
		  eval("var func = " + animation.predicate + ";");

		  // add this transition to the state machine
		  this.sm.transition(animation.name, animation.from, animation.to, func);
	  } // end if transition
  }, this); // end foreach animation

  // play the animation for the default initial state (the first state to be declared in the file)
  this.animations.play( this.sm.initialState );

  // finally add this (Phaser.Sprite extension) object we just defined to the Phaser game
  game.add.existing(this);
} // end AnimatedEntity = function()


AnimatedEntity.prototype = Object.create(Phaser.Sprite.prototype);
AnimatedEntity.prototype.constructor = AnimatedEntity;


AnimatedEntity.prototype.update = function () {
  this.sm.update();
}