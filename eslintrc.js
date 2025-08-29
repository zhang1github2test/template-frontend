module.exports = {
    root: true,
    extends: [
        '@antfu'
    ],
    rules: {
        // 允许console
        'no-console': 'off',
        // 允许debugger
        'no-debugger': 'off',
        // 允许any类型
        '@typescript-eslint/no-explicit-any': 'off',
        // 允许空函数
        '@typescript-eslint/no-empty-function': 'off',
        // 允许未使用的变量（以_开头）
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ],
        // Vue相关规则
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'off'
    }
}