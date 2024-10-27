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
            <div class="title">患者信息</div>
            <label>分期:
                <select id="stage">
                    <option value="IIIa">IIIa</option>
                    <option value="IIIb">IIIb</option>
                </select>
            </label>
            <label>Child-Pugh评分: <input id="childPughScore" type="number" value="7" min="5" max="15"></label>
            <label>PS评分: <input id="psScore" type="number" value="0" min="0" max="4"></label>
            <button id="submit">分配队列</button>
            <div id="result" class="result"></div>
        </div>
    `;

    // 添加按钮事件
    document.getElementById("submit").addEventListener("click", () => {
        const patient = new Patient(
            document.getElementById("stage").value,
            parseInt(document.getElementById("childPughScore").value),
            "A", // 默认级别
            false, // 是否有肝外转移
            parseInt(document.getElementById("psScore").value),
            "I", // 门静脉类型
            2, // 默认肿瘤数量
            "半肝", // 默认位置
            0, // 默认转移病灶数
            0 // 默认器官数
        );
        const assignedQueue = assignQueue(patient);
        document.getElementById("result").innerText = assignedQueue ? `分配的队列: ${assignedQueue}` : "未找到匹配的队列";
    });
}

renderApp();
