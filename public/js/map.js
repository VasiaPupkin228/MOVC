function resize(canvas){
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight-document.getElementById("menu").scrollHeight
}
paper.install(window);
window.onload = function() {
    let canvas = document.getElementById('map-canvas');
    resize(canvas);

    paper.setup(canvas);
    
    let start = new Point(250, 250);

    var tool = new Tool();

    var quad = new Path.Rectangle({
        point: [75, 75],
        size: [75, 75],
        strokeColor: 'black'
    });
    
    view.onFrame = (event)=> {
        // Each frame, rotate the path by 3 degrees:
        quad.rotate(3);
    }
    
    tool.onMouseDown = function(event) {
        path = new Path();
        path.strokeColor = 'green';
        path.add(event.point);
    }

    tool.onMouseDrag = function(event) {
        path.add(event.point);
    }
    tool.onMouseUp = (event)=>{
        var myCircle = new Path.Circle({
            center: event.point,
            radius: 10
        });
        myCircle.strokeColor = 'black';
        myCircle.fillColor = 'white';
    }
}