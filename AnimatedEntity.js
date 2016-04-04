//
// AnimatedEntity
//
// by Edgar Armenta Espinosa
// based on 'Killian.js' by Adam Roth
// modified from https://github.com/aroth/phaser-extend-sprite-statemachine-example

AnimatedEntity = function (game, x, y, anim_data) {
  // id of the sprite atlas this entity will use
  this.atlas_name = anim_data.name;

  // Sprite Constructor
  Phaser.Sprite.call(this, game, x, y, this.atlas_name);

  // State Machine
  this.sm = new StateMachine( this, { debug: false } );
  var self = this;
  
  // Create Animations, States & Transitions
  anim_data.animations.forEach(function (animation) {
  // Loop through all the animations contained in the data retrieved from file at 'game.preload'
  // We must make sure to define in the file all the states first and then all the transitions

      // Animations
      this.animations.add(animation.name, animation.frames, animation.frameRate, animation.loop);

      // State Machine States
      if (animation.type == "state")
      {
	  var state_events = {}
	  animation.events.forEach(function (event) {
	      // turn the string in the file into runnable code
	      eval("var func = " + event.predicate + ";");
	      state_events[event.name] = func;
	  }, this);
	  this.sm.state(animation.name, state_events);   
      } // end if state

      // State Machine Transitions
      if (animation.type == "transition")
      {
	  // turn the string in the file into runnable code
	  eval("var func = " + animation.predicate + ";");
	  this.sm.transition(animation.name, animation.from, animation.to, func);
      } // end if transition

  }, this); // end foreach animation

  // play the animation for the default initial state (the first state to be declared in the file)
  this.animations.play( this.sm.initialState );

  game.add.existing(this);
} // end AnimatedEntity

AnimatedEntity.prototype = Object.create(Phaser.Sprite.prototype);
AnimatedEntity.prototype.constructor = AnimatedEntity;

AnimatedEntity.prototype.update = function () {
  this.sm.update();
}
