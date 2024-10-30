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
    if (!(patient.childPughScore <= 7 && patient.psScore >= 0 && patient.psScore <= 2)) {
        return null;
    }
    if (patient.stage === "IIIa" && matchesQueueA1(patient)) {
        return "IIIa1";
    }
    if (patient.stage === "IIIa" && matchesQueueA2(patient)) {
        return "IIIa2";
    }
    if (patient.stage === "IIIa" && matchesQueueA3(patient)) {
        return "IIIa3";
    }
    if (patient.stage === "IIIb" && matchesQueueB1(patient)) {
        return "IIIb1";
    }
    if (patient.stage === "IIIb" && !matchesQueueB1(patient)) {
        return "IIIb2";
    }
    return null;
}

// 队列 A1 的判断逻辑
function matchesQueueA1(patient) {
    return (patient.portalVeinType === "I" || patient.portalVeinType === "II") && patient.tumorCount <= 3 && patient.tumorLocation === "半肝";
}

// 队列 A2 的判断逻辑
function matchesQueueA2(patient) {
    return (patient.portalVeinType === "I" || patient.portalVeinType === "II") && (patient.tumorCount > 3 || patient.tumorLocation === "全肝");
}

// 队列 A3 的判断逻辑
function matchesQueueA3(patient) {
    return (patient.portalVeinType === "III" || patient.portalVeinType === "IV");
}

// 队列 B1 的判断逻辑
function matchesQueueB1(patient) {
    return (patient.affectedOrgans <= 2 && patient.metastasisCount <= 5) && patient.hasExtrahepaticMetastasis;
}

// 队列 B2 的判断逻辑
function matchesQueueB2(patient) {
    return (patient.affectedOrgans > 2 || patient.metastasisCount > 5 ) && patient.hasExtrahepaticMetastasis;
}

// 渲染表单和结果
function renderApp() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="container">
            <h1 class="title">患者分配系统</h1>
            <form id="patientForm">
                <!-- 分期选择 -->
                <div class="form-group">
                    <label>分期:
                        <select id="stage">
                            <option value="IIIa">IIIa</option>
                            <option value="IIIb">IIIb</option>
                        </select>
                    </label>
                </div>

                <div class="form-group">
                    <label>ECOG PS评分:
                        <input id="psScore" type="number" value="0" min="0" max="4" required>
                    </label>
                </div>

                <!-- Child-Pugh评分和级别 -->
                <div class="form-group">
                    <label>Child-Pugh评分:
                        <input id="childPughScore" type="number" value="7" min="5" max="15" required>
                    </label>
                </div>
                <div class="form-group">
                    <label>Child-Pugh级别:
                        <select id="childPughGrade">
                            <option value="A">A</option>
                            <option value="B">B</option>
                        </select>
                    </label>
                </div>

                <!-- 其他信息 -->

                <!-- 程氏分型和肿瘤数量，仅在 IIIa 时显示 -->
                <div id="portalVeinTypeContainer" class="form-group">
                    <label>程氏分型:
                        <select id="portalVeinType">
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </label>
                </div>

                <div id="tumorCountContainer" class="form-group">
                    <label>肿瘤数量:
                        <input id="tumorCount" type="number" value="2" min="1" required>
                    </label>
                </div>

                <div id="tumorLocationContainer" class="form-group">
                    <label>肿瘤位置:
                        <select id="tumorLocation">
                            <option value="半肝">半肝</option>
                            <option value="全肝">全肝</option>
                        </select>
                    </label>
                </div>

                <!-- 转移病灶数量和受累器官，仅在 IIIb 时显示 -->
                <div id="hasExtrahepaticMetastasisContainer" class="form-group" style="display: none;">
                    <label>是否有肝外转移:
                        <select id="hasExtrahepaticMetastasis">
                            <option value="false">否</option>
                            <option value="true">是</option>
                        </select>
                    </label>
                </div>
                <div id="metastasisContainer" class="form-section" style="display: none;">
                    <div class="form-group">
                        <label>转移病灶数量:
                            <input id="metastasisCount" type="number" value="0" min="0" required>
                        </label>
                    </div>
                    <div class="form-group">
                        <label>受累器官数量:
                            <input id="affectedOrgans" type="number" value="0" min="0" required>
                        </label>
                    </div>
                </div>

                <button type="button" id="submit">分配队列</button>
                <div id="result" class="result"></div>
            </form>
        </div>
    `;

    // 绑定事件监听器
    document.getElementById("stage").addEventListener("change", toggleFields);
    document.getElementById("submit").addEventListener("click", submitForm);

    toggleFields();  // 初始时根据默认值更新可见性
}

function toggleFields() {
    const stage = document.getElementById("stage").value;
    const portalVeinTypeContainer = document.getElementById("portalVeinTypeContainer");
    const tumorCountContainer = document.getElementById("tumorCountContainer");
    const tumorLocationContainer = document.getElementById("tumorLocationContainer");
    const metastasisContainer = document.getElementById("metastasisContainer");
    const hasExtrahepaticMetastasisContainer = document.getElementById("hasExtrahepaticMetastasisContainer");

    // 根据分期动态显示/隐藏特定字段
    if (stage === "IIIa") {
        portalVeinTypeContainer.style.display = "block";
        tumorCountContainer.style.display = "block";
        tumorLocationContainer.style.display = "block";
        metastasisContainer.style.display = "none";
        hasExtrahepaticMetastasisContainer.style.display = "none";
    } else if (stage === "IIIb") {
        portalVeinTypeContainer.style.display = "none";
        tumorCountContainer.style.display = "none";
        tumorLocationContainer.style.display = "none";
        metastasisContainer.style.display = "flex";
        hasExtrahepaticMetastasisContainer.style.display = "flex";
    }
}

function submitForm() {
    const patient = new Patient(
        document.getElementById("stage").value,
        parseInt(document.getElementById("childPughScore").value),
        document.getElementById("childPughGrade").value,
        const hasExtrahepaticMetastasis = stage === "IIIb" ? document.getElementById("hasExtrahepaticMetastasis").value === "true" : false,
        parseInt(document.getElementById("psScore").value),
        const portalVeinType = stage === "IIIa" ? document.getElementById("portalVeinType").value : null;
        const tumorCount = stage === "IIIa" ? parseInt(document.getElementById("tumorCount").value) : 0;
        const tumorLocation = stage === "IIIa" ? document.getElementById("tumorLocation").value : null,
        const metastasisCount = stage === "IIIb" ? parseInt(document.getElementById("metastasisCount").value) : 0,
        const affectedOrgans = stage === "IIIb" ? parseInt(document.getElementById("affectedOrgans").value) : 0
    );

    const assignedQueue = assignQueue(patient);
    document.getElementById("result").innerText = assignedQueue 
        ? `分配的队列: ${assignedQueue}` 
        : "未找到匹配的队列";
}

renderApp();
