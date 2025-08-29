// utils/icon.ts
import type { Component } from 'vue'
import {
    DataBoard,
    User,
    Lock,
    Setting,
    Grid,
    Expand,
    Fold,
    ArrowDown,
    SwitchButton,
    Menu,
    Document,
    Folder,
    Star,
    Bell,
    Search,
    Edit,
    Delete,
    Plus,
    Refresh,
    Download,
    Upload,
    View,
    Hide,
    Check,
    Close,
    Warning,
    InfoFilled,
    SuccessFilled,
    CircleClose,
    House,
    Monitor,
    TrendCharts,
    PieChart,
    List,
    Operation,
    Tools,
    Key,
    UserFilled,
    Avatar,
    Phone,
    Message,
    Location,
    Calendar,
    Clock,
    Files,
    Notebook,
    Reading,
    School
} from '@element-plus/icons-vue'

// 图标映射表
const iconMap: Record<string, Component> = {
    // 常用图标
    'data-board': DataBoard,
    'user': User,
    'lock': Lock,
    'setting': Setting,
    'grid': Grid,
    'expand': Expand,
    'fold': Fold,
    'arrow-down': ArrowDown,
    'switch-button': SwitchButton,
    'menu': Menu,
    'document': Document,
    'folder': Folder,
    'star': Star,
    'bell': Bell,
    'search': Search,
    'edit': Edit,
    'delete': Delete,
    'plus': Plus,
    'refresh': Refresh,
    'download': Download,
    'upload': Upload,
    'view': View,
    'hide': Hide,
    'check': Check,
    'close': Close,
    'warning': Warning,
    'info-filled': InfoFilled,
    'success-filled': SuccessFilled,
    'circle-close': CircleClose,
    'house': House,
    'monitor': Monitor,
    'trend-charts': TrendCharts,
    'pie-chart': PieChart,
    'list': List,
    'operation': Operation,
    'tools': Tools,
    'key': Key,
    'user-filled': UserFilled,
    'avatar': Avatar,
    'phone': Phone,
    'message': Message,
    'location': Location,
    'calendar': Calendar,
    'clock': Clock,
    'files': Files,
    'notebook': Notebook,
    'reading': Reading,
    'school': School
}

/**
 * 根据图标名称获取对应的组件
 * @param iconName 图标名称，支持 ep: 前缀
 * @returns Element Plus 图标组件
 */
export function getIcon(iconName?: string): Component | null {
    if (!iconName) return null

    // 处理 ep: 前缀
    let name = iconName
    if (iconName.startsWith('ep:')) {
        name = iconName.substring(3)
    }

    // 统一转换为小写并使用连字符
    const normalizedName = name
        .replace(/([A-Z])/g, '-$1') // 大写字母前加连字符
        .toLowerCase()
        .replace(/^-/, '') // 移除开头的连字符

    return iconMap[normalizedName] || null
}

/**
 * 检查图标是否存在
 * @param iconName 图标名称
 * @returns 是否存在
 */
export function hasIcon(iconName?: string): boolean {
    return getIcon(iconName) !== null
}

/**
 * 获取所有可用的图标名称
 * @returns 图标名称数组
 */
export function getAvailableIcons(): string[] {
    return Object.keys(iconMap)
}

// 导出图标映射表（可选）
export { iconMap }