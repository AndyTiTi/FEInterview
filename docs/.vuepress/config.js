//导入生成侧边栏的工具类
const path = require('path')
// const rootPath = path.dirname(__dirname)
// const { sideBarTool } = require(path.join(__dirname, './utils/index.js'))

// 需要排除的一些目录
// let unDirIncludes = ['node_modules', 'assets', 'public', 'dist']
// 只需要处理后缀的文件类型
// let SuffixIncludes = ['md', 'html']
//使用方法生生成侧边栏
// 侧边栏
// let sidebar = sideBarTool.genSideBarGroup(
// 	rootPath,
// 	unDirIncludes,
// 	SuffixIncludes,
// 	{}
// )
module.exports = {
	description: 'Just playing around',
	themeConfig: {
		displayAllHeaders: true,
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Introduce', link: '/other/' },
			{ text: '前端知识体系', link: '/interview/vue1' },
		],
		sidebarDepth: 3,
		// sidebar,
		sidebar: {
			'/other/': ['', '/other/installUse', '/other/webpack'],
			'/interview/': [
				{
					title: 'Vue篇',
					children: ['vue1', 'vue2'],
				},
				{
					title: 'React篇',
					children: ['react1', 'react2'],
				},
				{
					title: 'JavaScript篇',
					children: ['javascript1', 'javascript2'],
				},
				{
					title: 'TypeScript篇',
					children: ['typescript1', 'typescript2'],
				},
				{
					title: 'Webpack篇',
					children: ['webpack'],
				},
				{
					title: 'LeetCode篇',
					children: ['leetcode'],
				},
				{
					title: 'CSS篇',
					children: ['css'],
				},
				{
					title: 'GIT篇',
					children: ['git'],
				},
				{
					title: '优化篇',
					children: ['optimizaion'],
				},
				{
					title: '浏览器篇',
					children: ['browser'],
				},
				{
					title: '服务器篇',
					children: ['server1', 'server2'],
				},
				{
					title: '部署测试篇',
					children: ['cicd1', 'cicd2'],
				},
				{
					title: '杂记·备忘录',
					children: ['memorandum'],
				},
				// {
				// 	title: 'Webpack篇',
				// 	sidebarDepth: 2,
				// 	children: [
				// 		{
				// 			title: '第一章',
				// 			children: ['webpack1'],
				// 		},
				// 		{
				// 			title: '第二章',
				// 			children: ['webpack2'],
				// 		},
				// 		{
				// 			title: '第三章',
				// 			children: ['webpack3'],
				// 		},
				// 	],
				// },
			],
		},
		lastUpdated: '最后更新时间',
		logo: '/head.png',
		authorAvatar: '/head.png',
		// 搜索设置
		search: true,
		searchMaxSuggestions: 10,
	},
	plugins: [
		'@vuepress/medium-zoom',
		[
			'vuepress-plugin-code-copy',
			{
				color: '#fff',
			},
		],
	],
	markdown: {
		lineNumbers: true,
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@alias': './images',
			},
		},
	},
}
