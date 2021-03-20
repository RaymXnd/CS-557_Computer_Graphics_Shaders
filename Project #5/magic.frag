#version 330 compatibility

float ResS;
float ResT;

in vec2 vST;

uniform bool uCircle;

uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;
uniform float uRotAngle;
uniform float uMagFactor;
uniform float uSharpFactor;
uniform sampler2D uImageUnit;

void main()
{
	float s = vST.s;
	float t = vST.t;
	float top	 = uSc + uDs;
	float bottom = uSc - uDs;
	float left   = uTc - uDt;
	float right  = uTc + uDt;

	//To know the resolution of this texture
	ivec2 ires = textureSize( uImageUnit, 0 );
	float ResS = float( ires.s );
	float ResT = float( ires.t );

	vec3 rgb = texture2D( uImageUnit, vST ).rgb;

	if(uCircle)
	{
		if((s - uSc) * (s - uSc) + (t - uTc) * (t - uTc) < uDs * uDs)
		{
			s = (s - uSc) * 1.0 / uMagFactor;
			t = (t - uTc) * 1.0 / uMagFactor;

			//Project note hint
			float S = s*cos(uRotAngle) - t*sin(uRotAngle) + uSc;
			float T = s*sin(uRotAngle) + t*cos(uRotAngle) + uTc;

			vec2 m = vec2(S,T);
			vec3 n = texture2D(uImageUnit, m).rgb;

			//Sharpening function
			vec2 stp0 = vec2(1./ResS,  0. );
			vec2 st0p = vec2(0.     ,  1./ResT);
			vec2 stpp = vec2(1./ResS,  1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 =   texture2D( uImageUnit, m ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, m-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, m+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, m-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, m+stpm ).rgb;
			vec3 im10 =  texture2D( uImageUnit, m-stp0 ).rgb;
			vec3 ip10 =  texture2D( uImageUnit, m+stp0 ).rgb;
			vec3 i0m1 =  texture2D( uImageUnit, m-st0p ).rgb;
			vec3 i0p1 =  texture2D( uImageUnit, m+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4( mix( target, n, uSharpFactor ), 1. );
		}else{
			gl_FragColor = vec4( rgb, 1. );
		}
	}else{
		float top	 = uSc + uDs;
		float bottom = uSc - uDs;
		float left   = uTc - uDt;
		float right  = uTc + uDt;
		
		if( s < top && s > bottom && t > left && t < right )
		{
			s = (s - uSc) * 1.0 / uMagFactor;
			t = (t - uTc) * 1.0 / uMagFactor;

			//Project note hint
			float S = s*cos(uRotAngle) - t*sin(uRotAngle) + uSc;
			float T = s*sin(uRotAngle) + t*cos(uRotAngle) + uTc;

			vec2 m = vec2(S,T);
			vec3 n = texture2D(uImageUnit, m).rgb;

			//Sharpening
			vec2 stp0 = vec2(1./ResS,  0. );
			vec2 st0p = vec2(0.     ,  1./ResT);
			vec2 stpp = vec2(1./ResS,  1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 =   texture2D( uImageUnit, m ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, m-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, m+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, m-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, m+stpm ).rgb;
			vec3 im10 =  texture2D( uImageUnit, m-stp0 ).rgb;
			vec3 ip10 =  texture2D( uImageUnit, m+stp0 ).rgb;
			vec3 i0m1 =  texture2D( uImageUnit, m-st0p ).rgb;
			vec3 i0p1 =  texture2D( uImageUnit, m+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target = target + 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target = target + 2.*(im10+ip10+i0m1+i0p1);
			target = target + 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4( mix( target, n, uSharpFactor ), 1. );
		}else
		{
			gl_FragColor = vec4( rgb, 1. );
		}
    }
}