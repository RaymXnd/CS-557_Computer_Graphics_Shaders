#version 330 compatibility
//rings to implement noise.

uniform float Timer;
uniform float uA = 5.;
uniform float uP = 0.25;
uniform sampler3D Noise3;
uniform float uTol = 0.06;
uniform float uAlpha = 0.2;
uniform float uNoiseAmp = 4.5;
uniform float uNoiseFreq = 1.;
//in
in vec2  vST;
in vec3 vColor;
in float vX, vY;
in vec3 vMCposition;
in float vLightIntensity;

const vec3 WHITE = vec3( 0.1, 0.1, 0.1 );
const vec3 GRAY = vec3( 0.41, 0.41, 0.41 );
void
main( )
{
	vec4 nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	// give the noise a range of [-1.,+1.]:
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	n *= uNoiseAmp;

	//rgb animating color
	vec3 color_rbg = vec3( vST.s, vST.t, abs(sin(3.14 * Timer)) );

	//draw rings
	float r = sqrt( vX*vX + vY*vY );
	float ds = vST.s - r;
	float rfrac = fract( uA*r );
	float dt = vST.t - rfrac;
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;     
	ds *= scale; // scale by noise factor
	ds /= r; // ellipse equation
	dt *= scale; // scale by noise factor
	dt /= rfrac; // ellipse equation

	//compute d using the new ds and dt
	float d = ds*ds + dt*dt;

	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, rfrac ) - smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, d ); // “smoothpulse”
	vec3 rgb = vLightIntensity * mix( WHITE, GRAY, t );

	gl_FragColor = mix(vec4(vLightIntensity * WHITE, 1), vec4(vLightIntensity * GRAY, uAlpha), t);
	//gl_FragColor = vec4( rgb + color_rbg, 1.0 );
}