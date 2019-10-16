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
</a>`;

Vue.component('social-link', {
	props: ['address', 'icon', 'title'],
	template: socialLinkTemplate
});

var app = new Vue({
	el: '#card',
	data: {
		socials: SOCIALS,
	}
});