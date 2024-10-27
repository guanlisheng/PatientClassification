// 模拟患者数据结构和队列分配逻辑
class Patient {
    constructor(stage, childPughScore, childPughGrade, hasExtrahepaticMetastasis, psScore, portalVeinType, tumorCount, tumorLocation, metastasisCount, affectedOrgans) {
        this.stage = stage;
        this.childPughScore = childPughScore;
        this.childPughGrade = childPughGrade;
        this.hasExtrahepaticMetastasis = hasExtrahepaticMetastasis;
        this.psScore = psScore;
        this.portalVeinType = portalVeinType;
        this.tumorCount = tumorCount;
        this.tumorLocation = tumorLocation;
        this.metastasisCount = metastasisCount;
        this.affectedOrgans = affectedOrgans;
    }
}

// 队列判断逻辑
function assignQueue(patient) {
    if (patient.stage === "IIIa" && patient.childPughScore <= 7 && patient.psScore >= 0 && patient.psScore <= 2 && !patient.hasExtrahepaticMetastasis && matchesQueueA(patient)) {
        return "A";
    }
    if (patient.stage === "IIIa" && patient.childPughScore <= 7 && patient.psScore >= 0 && patient.psScore <= 2 && !matchesQueueA(patient)) {
        return "B";
    }
    if (patient.stage === "IIIb" && patient.childPughScore <= 7 && patient.psScore >= 0 && patient.psScore <= 2 && matchesQueueC(patient)) {
        return "C";
    }
    if (patient.stage === "IIIb" && patient.childPughScore <= 7 && patient.psScore >= 0 && patient.psScore <= 2 && !matchesQueueC(patient)) {
        return "D";
    }
    return null;
}

// 队列 A 的判断逻辑
function matchesQueueA(patient) {
    return (patient.portalVeinType === "I" || patient.portalVeinType === "II") && patient.tumorCount <= 3 && patient.tumorLocation === "半肝";
}

// 队列 C 的判断逻辑
function matchesQueueC(patient) {
    return patient.metastasisCount <= 5 && patient.affectedOrgans <= 2 && !patient.hasExtrahepaticMetastasis;
}

// 渲染表单和结果
function renderApp() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="container">
            <h1 class="title">患者分配系统</h1>
            <form id="patientForm">
                <!-- 患者基础信息 -->
                <div class="form-section">
                    <label>分期:
                        <select id="stage">
                            <option value="IIIa">IIIa</option>
                            <option value="IIIb">IIIb</option>
                        </select>
                    </label>
                    <label>Child-Pugh评分: 
                        <input id="childPughScore" type="number" value="7" min="5" max="15" required>
                    </label>
                    <label>Child-Pugh级别:
                        <select id="childPughGrade">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </label>
                    <label>是否有肝外转移:
                        <select id="hasExtrahepaticMetastasis">
                            <option value="false">否</option>
                            <option value="true">是</option>
                        </select>
                    </label>
                </div>
                
                <!-- 患者体力评分与肿瘤信息 -->
                <div class="form-section">
                    <label>PS评分:
                        <input id="psScore" type="number" value="0" min="0" max="4" required>
                    </label>
                    <label>门静脉类型:
                        <select id="portalVeinType">
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </label>
                    <label>肿瘤数量:
                        <input id="tumorCount" type="number" value="2" min="1" required>
                    </label>
                    <label>肿瘤位置:
                        <select id="tumorLocation">
                            <option value="半肝">半肝</option>
                            <option value="全肝">全肝</option>
                        </select>
                    </label>
                </div>
                
                <!-- 转移和受累器官信息 -->
                <div class="form-section">
                    <label>转移病灶数量:
                        <input id="metastasisCount" type="number" value="0" min="0" required>
                    </label>
                    <label>受累器官数量:
                        <input id="affectedOrgans" type="number" value="0" min="0" required>
                    </label>
                </div>

                <!-- 提交按钮和结果 -->
                <button type="button" id="submit">分配队列</button>
                <div id="result" class="result"></div>
            </form>
        </div>
    `;

    // 添加按钮点击事件监听器
    document.getElementById("submit").addEventListener("click", () => {
        const patient = new Patient(
            document.getElementById("stage").value,
            parseInt(document.getElementById("childPughScore").value),
            document.getElementById("childPughGrade").value,
            document.getElementById("hasExtrahepaticMetastasis").value === "true",
            parseInt(document.getElementById("psScore").value),
            document.getElementById("portalVeinType").value,
            parseInt(document.getElementById("tumorCount").value),
            document.getElementById("tumorLocation").value,
            parseInt(document.getElementById("metastasisCount").value),
            parseInt(document.getElementById("affectedOrgans").value)
        );

        const assignedQueue = assignQueue(patient);
        document.getElementById("result").innerText = assignedQueue 
            ? `分配的队列: ${assignedQueue}` 
            : "未找到匹配的队列";
    });
}

renderApp();
