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


var socialLinkTemplate = `
<a target="_blank" rel="noopener noreferrer"
	:href="address">

	<i :class="icon"></i>
	&nbsp;
	<title>{{ title }}</title>
</a>
`;

var profileTemplate = `
<div>
	<strong id="name">{{ name }}</strong>
	<br>
	<em id="career">{{ career }}</em>
	<br>
	<i class="fas fa-map-marker-alt"></i>
	{{ location }}
</div>
`;

var photoTemplate = `
<div>
	<img :id="id" :src="src" :alt="alt">
</div>
`;

Vue.component('social-link', {
	props: ['address', 'icon', 'title'],
	template: socialLinkTemplate
});

Vue.component('profile', {
	props: ['name', 'career', 'location'],
	template: profileTemplate
});

Vue.component('photo', {
	props: ['id', 'src', 'alt'],
	template: photoTemplate
});

var app = new Vue({
	el: '#card',
	data: {
		name: 'Joshua Moore',
		career: 'Software developer',
		location: 'Edmonton, Alberta',
		photo: {
			id: 'profile-picture',
			src: 'https://space.jmoore.dev/images/profile-normal-small.jpg',
			alt: 'Profile picture of Joshua Moore.'
		},
		socials: SOCIALS,
	}
});