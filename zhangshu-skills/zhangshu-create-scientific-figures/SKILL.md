---
name: zhangshu-create-scientific-figures
description: Convert verified clinical research results into reproducible publication-grade figures with explicit result references, plot specifications, code, journal styling, and export manifests. Use for Kaplan-Meier curves, forest plots, ROC curves, calibration plots, volcano plots, nomograms, and scientific figure review or export.
---

# 发表级科研制图

将 Verified Result 转换为可复现 Figure Asset；布局可以优化，数据不可改变。

## Workflow

1. 读取 Verified Result、result refs、表达目标和目标期刊。
2. 读取 `references/figure-rules.md`，选择图形和视觉编码。
3. 生成 Plot Spec，展示数据映射、尺寸、语言和样式。
4. 等待用户确认图形类型与视觉编码。
5. 生成 Python/R 代码，在隔离环境中渲染。
6. 优化标签、图例、留白和可访问性，不改变数据。
7. 运行 `scripts/validate_plot_spec.py` 校验结果引用和范围。
8. 使用 `assets/figure-caption-template.md` 生成图注并导出 SVG/PDF/PNG、代码和 manifest。

## Boundaries

- 正式图必须绑定 Verified Result。
- 不截断坐标误导差异，不选择性隐藏不利数据。
- 期刊样式携带规则版本和更新时间。
- 最终视觉编码和导出属于强制确认点。

## Output Contract

交付 Plot Spec、Figure Asset、矢量/位图文件、绘图代码、运行环境、图注和结果引用 manifest。
