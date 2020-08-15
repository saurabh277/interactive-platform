let config={
    type:Phaser.AUTO,
    
    scale:{
        mode:Phaser.Scale.FIT,
        width:800,
        height:600,
    },
    backgroundColor:0xffff11,
    physics:{
        default:'arcade',
        arcade:{
        gravity:{
            y:1000,
        } ,
       // debug:true,   
        }
        
    },
    scene:{
        preload:preload,
        create:create,
        update:update,
        
    }
};

let game=new Phaser.Game(config);
let game_config={
    player_speed:200,
    player_jump:-600,
}
function preload(){
     this.load.image("ground","Assets/topground.png");
    this.load.image("sky","Assets/background.jpg");
    this.load.spritesheet("dude","Assets/du.png",{frameWidth:55,frameHeight:82});
    this.load.image("apple","Assets/apple.png");
     this.load.image("ray","Assets/ray.png");
    
    console.log("preload");
    
}
function create(){
     console.log("create");
    W=game.config.width;
    H=game.config.height;
    //try to ceate a background
    let background=this.add.sprite(0,0,"sky");
    background.setScale(2.5);  
   // background.depth=-2;
    //add tilesprites
    let ground=this.add.tileSprite(0,H-140,W,140,"ground");
    ground.setOrigin(0,0);
    
    //create rays on the top of background
    let rays=[];
    
    for(let i=-10;i<=10;i++){
    let ray=this.add.sprite(W/2,H-140,'ray');
    ray.displayHeight=5.2 *H;
    ray.setOrigin(1,1);
    ray.alpha=0.2
    ray.angle=i*20;
        //ray.depth=-1;
     rays.push(ray);
    }
    //tween
    this.tweens.add({
        targets:rays,
        props:{
            angle:{
            value : "+=20",
        },
        },
        duration:6000,
        repeat:-1,
    })
    this.player=this.physics.add.sprite(100,100,'dude',1);
    console.log(this.player);
    this.player.setBounce(0.3);//elasticity of collision-where energy lost at every step
   //don;t allow player to go out of world
    this.player.setCollideWorldBounds(true);
    
    
    //player animations and player movements
    this.anims.create({
        key:'left',
       // frames:this.anims.generateFrameNumbers("dude",{start:0,end:0}),
        frames:[{key:'dude',frame:0}],
        frameRate:10,
        repeat:-1,
    });
     this.anims.create({
        key:'center',
       frames:[{key:'dude',frame:1}],
        frameRate:10,
       // repeat:-1,
    });
     this.anims.create({
        key:'right',
        frames:[{key:'dude',frame:2}], //frames:this.anims.generateFrameNumbers("dude",{start:2,end:2}),
        frameRate:10,
        repeat:-1,
    });
    
    
    
    //keyboard
   this.cursors=this.input.keyboard.createCursorKeys();
    
    //add a group of apples =physical object
    let fruits=this.physics.add.group({
    key:"apple",
        repeat:8,
        setScale:{x:0.06,y:0.06}, 
        setXY:{x:10,y:0,stepX:100},
        
    });
    //add bouncing effeccts to all the apples
    
    fruits.children.iterate(function(f){
     f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
                           
})
    
    //create more platform 
    let platforms = this.physics.add.staticGroup();
   platforms.create(450,370,'ground').setScale(0.2,0.4).refreshBody();
    platforms.create(700,200,'ground').setScale(0.4,0.4).refreshBody(); 
    platforms.create(100,200,'ground').setScale(0.2,0.4).refreshBody(); 
    platforms.add(ground);
    
    
    
    this.physics.add.existing(ground);
    ground.body.allowGravity=false;
    ground.body.immovable=true;
    
    //add coliision detection btw player and ground
    this.physics.add.collider(this.player,platforms);
    //this.physics.add.collider(ground,fruits);
     this.physics.add.collider(platforms,fruits);
    
    this.physics.add.overlap(this.player,fruits,eatFruits,null,this);
    
    //create cameras
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.5);
}




function update(){
    
if(this.cursors.left.isDown){
   
    this.player.setVelocityX(-game_config.player_speed);
    this.player.anims.play('left',true);
}   
else if(this.cursors.right.isDown){
    
    this.player.setVelocityX(+game_config.player_speed);
    this.player.anims.play('right',true);
} 
    else{
        this.player.setVelocityX(0);
        this.player.anims.play('center');
    }
    //add jumping ability,stop player when in air
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocity(game_config.player_jump);
    }
}
function eatFruits(player,fruit){
     fruit.disableBody(true,true);
     
        
}
