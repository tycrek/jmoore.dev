// jmoore.dev //

// Information for social links //
const SOCIALS = [
	{
		address: 'mailto:josh.moore@jmoore.dev',
		icon: 'far fa-envelope',
		title: 'Email',
		id: 1
	},
	{
		address: 'https://www.linkedin.com/in/joshua-moore-95445313b/',
		icon: 'fab fa-linkedin',
		title: 'LinkedIn',
		id: 2
	},
	{
		address: 'https://github.com/tycrek',
		icon: 'fab fa-github',
		title: 'GitHub',
		id: 3
	},
	{
		address: 'https://instagram.com/tycrek',
		icon: 'fab fa-instagram',
		title: 'Instagram',
		id: 4
	}
];

// Vue.js component templates //
const TEMPLATES = {
	socialLink: `
		<a :href="address" class="social-item" target="_blank" rel="noopener noreferrer">
			<i :class="icon"></i>
			<span class="social-title">{{ title }}</span>
		</a>`,
	profile: `
		<div>
			<strong id="name">{{ name }}</strong><br>
			<em id="career">{{ career }}</em><br>
			<i class="fas fa-map-marker-alt"></i>
			<span id="location">{{ location }}</span>
		</div>`,
	photo: `
		<div>
			<img id="photo" :src="src" :alt="alt">
		</div>`
};

// Vue.js primary data object //
const DATA = {
	name: 'Joshua Moore',
	career: 'Software developer',
	location: 'Edmonton, Alberta',
	photo: {
		src: 'https://space.jmoore.dev/images/profile-normal-small.jpg',
		alt: 'Profile picture of Joshua Moore.'
	},
	socials: SOCIALS,
};

// Vue.js components //
Vue.component('social-link', {
	props: ['address', 'icon', 'title'],
	template: TEMPLATES.socialLink
});

Vue.component('profile', {
	props: ['name', 'career', 'location'],
	template: TEMPLATES.profile
});

Vue.component('photo', {
	props: ['src', 'alt'],
	template: TEMPLATES.photo
});

// Vue.js app //
var app = new Vue({
	el: '#card',
	data: DATA
});