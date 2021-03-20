#version 330 compatibility
out vec2 vST;
uniform float Timer;
out vec3 vColor;
out vec3 MCposition;
void
main( )
{
	vST = gl_MultiTexCoord0.st;
	//gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	float x = gl_Vertex.x;
    float y = gl_Vertex.y;
    float z = gl_Vertex.z;

    if (x > 2.){
        x = x + sin(Timer * 0.5);
        y = y - sin(Timer * 0.5);
        //z = z + sin(Timer * 2.);
        }
    vec4 new_vertex = vec4 (x, y ,z, gl_Vertex.w);

    MCposition = gl_Vertex.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * new_vertex;
}