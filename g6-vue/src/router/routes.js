import Layout from '@/Layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: {name: 'createNodeFreely'},
    children: [
      {
        path: 'createNodeFreely',
        name: 'createNodeFreely',
        component: () => import('@/views/createNodeFreely/createNodeFreely.vue')
      }
    ]
  }
]

export default routes