export default {
  tag: 'app-design',
  name: 'Design',
  icon: 'palette-fill',
  render: ({ cljs }) => cljs`
  [:app-bootstrapp
    [:div
      {
        :class "bg-blue-500 h-50 w-50"
      }
      Teste
    ]
  ]
  `,
};

