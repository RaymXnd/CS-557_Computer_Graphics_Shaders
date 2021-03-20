#version 330 compatibility
out vec3 vNormal;
void
main( )
{
	gl_Position = gl_Vertex;
	vNormal = gl_Normal;
    
}