#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

//The geometry shader layouts
layout( triangles ) in;
layout( triangle_strip, max_vertices=204 ) out;

//varibales:
vec3 V0, V01, V02;
vec3 N0, N01, N02;

uniform int uLevel;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;
uniform float uQuantize;
uniform bool uModelCoords;

//Pass a vNormal and the built-in gl_Position from the vertex shader to the geometry shader.
//Pass a gLightIntensity and the built-in gl_Position from the geometry shader to the rasterizer.
in vec3 vNormal[3];
out float gLightIntensity;
const vec3 lightPos = vec3(0., 10., 0.);

//quantize a single number
float
Quantize( float f )
{
	// quantize a single number
	f *= uQuantize;
	f += .5;		// round-off
	int fi = int( f );
	f = float( fi ) / uQuantize;
	return f;
}

//In the geometry shader, when emitting the output triangles, calculate and quantize each xyz vertex
vec3
QuantizedVertex( float s, float t )
{
	vec3 v = V0 + t * V02 + s * V01;
	
	if(!uModelCoords)//which coordinate system are you quantizing in
	{ 
		v = ( gl_ModelViewMatrix * vec4( v, 1 ) ).xyz;
	}

	v.x = Quantize( v.x );
	v.y = Quantize( v.y );
	v.z = Quantize( v.z );
	return v;
}

//produce and emit a single vertex 
void ProduceVertex( float s, float t ){
    vec3 lightPos = vec3( uLightX, uLightY, uLightZ );

	vec3 v = QuantizedVertex( s, t );

	vec3 n = N0 + s * N01 + t * N02;// interpolate the normal from s and t
	vec3 tnorm = normalize(gl_NormalMatrix * n);// transformed normal

	vec4 ECposition;
	if( uModelCoords)//which coordinate system are you quantizing in
	{
		ECposition = gl_ModelViewMatrix * vec4( v, 1. );
	}
	else{
		ECposition = vec4( v, 1. );
	}
	//gLightIntensity  = ?????
	
	gLightIntensity  = abs( dot( normalize(lightPos - ECposition.xyz), tnorm ) );

	gl_Position = gl_ProjectionMatrix * ECposition;
	EmitVertex();
}

void 
main( ){

    V01 = (gl_PositionIn[1] - gl_PositionIn[0]).xyz;
    V02 = (gl_PositionIn[2] - gl_PositionIn[0]).xyz;
    V0 = gl_PositionIn[0].xyz;

    N01 =  vNormal[1] - vNormal[0];
    N02 =  vNormal[2] - vNormal[0];
    N0  =  vNormal[0];

    int numLayers = 1 << uLevel;

    float dt = 1. / float(numLayers);
    float t_top = 1.;

    for(int it = 0; it < numLayers; it++){
    
        float t_bot = t_top - dt;
        float smax_top = 1. - t_top;
        float smax_bot = 1. - t_bot;
		
        int nums = it + 1;
        float ds_top = smax_top / float(nums - 1);
        float ds_bot = smax_bot / float(nums);
		
		
        float s_top = 0.;
        float s_bot = 0.;
		
		
        for(int is = 0; is < nums; is++){
            ProduceVertex(s_bot, t_bot);
            ProduceVertex(s_top, t_top);
            s_top += ds_top;
            s_bot += ds_bot;
        }
		
        ProduceVertex(s_bot, t_bot);
        EndPrimitive();
		
        t_top = t_bot;
        t_bot -= dt;
    }
}
