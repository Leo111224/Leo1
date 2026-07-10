---
name: zhangshu-run-statistical-analysis
description: Validate an approved Analysis Plan, check statistical environment and model assumptions, run deterministic clinical statistical code in an isolated environment, audit analysis scripts, validate outputs, link code to results, and register reproducible Verified Results. Use when the user has a fixed dataset version and approved plan and needs real regression, survival, diagnostic, causal, meta-analysis, machine-learning execution, statistical software/environment checks, reproducible analysis packages, or analysis-code audit.
---

# 临床统计分析执行

Agent 负责编排、审计、执行和解释；正式统计数值只能由确定性执行器产生，不能由 LLM 编造或手算。

## Resource routing

- 执行统计、结果契约和解释边界读取 `references/execution-and-results.md`。
- 统计环境、依赖、脚本审计和可复现打包读取 `references/reproducibility-rules.md`。

## Tool workflow

1. Call `validate_analysis_plan` to fix the approved Analysis Plan, Dataset Version, Algorithm Version, variable mapping, and run scope.
2. Call `validate_statistical_environment` to check R/Python version, package versions, deterministic seed, worker image, permissions, and system dependencies.
3. Call `audit_analysis_script` if user provides scripts or if generated code will be reused; check hard-coded paths, hidden data mutation, uncontrolled randomness, missing package versions, and result-output mapping.
4. Call `check_model_assumptions` to distinguish warnings from blockers.
5. Call `estimate_run_cost` and show the actual execution checklist.
6. **Human gate R2**: confirm dataset version, model, variables, parameters, environment, and expected outputs before execution.
7. Call `execute_statistical_model` in an isolated Python/R worker. Save code, environment, seed, logs, warnings, and output files.
8. Call `validate_result_bundle`; run `scripts/validate_result_bundle.py` when a structured result bundle is available.
9. Call `link_code_to_result_items` so every Result Item points to code cell/script, dataset version, model parameters, and output artifact.
10. Call `generate_reproducible_run_manifest` and `package_analysis_code` when the user needs a reusable or auditable analysis package.
11. Call `explain_verified_result` only after validation passes or after explicitly marking limitations.
12. Register Verified Result only when validation passes.

## Boundaries

- Do not let LLM calculate or rewrite formal statistical numbers.
- Model changes create a new Analysis Plan or Analysis Run; do not overwrite history.
- Failed convergence, timeout, missing dependency, or validation failure blocks Verified Result registration.
- Do not delete non-significant results or alter P values.
- Do not silently fix scripts that change scientific meaning; route method changes back to F-05.

## Output contract

Deliver Analysis Run, Environment Report, Script Audit Report, assumption diagnostics, Result Bundle, Verified Result, reproducibility manifest, code package, random seed, logs, and result interpretation.

