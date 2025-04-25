// 路况数据 (这里是模拟数据，实际应用中应从服务器获取)
const roadConditions = {
  route1: {
    name: "新昌县城至镜岭镇",
    status: "normal", // normal, construction, congestion, closed
    maxWidth: 4.5,
    maxHeight: 4.5,
    maxLength: 12,
    maxWeight: 40,
    note: "道路状况良好，无特殊限制",
  },
  route2: {
    name: "新昌县城至大市聚镇",
    status: "construction",
    maxWidth: 4,
    maxHeight: 4.5,
    maxLength: 10,
    maxWeight: 35,
    note: "部分路段正在进行道路维修，通行受限",
  },
  route3: {
    name: "新昌县城至南明山景区",
    status: "congestion",
    maxWidth: 3.5,
    maxHeight: 4,
    maxLength: 9,
    maxWeight: 30,
    note: "景区道路较窄，且游客较多，通行缓慢",
  },
  route4: {
    name: "新昌县城至嵊州市区",
    status: "normal",
    maxWidth: 5,
    maxHeight: 5,
    maxLength: 15,
    maxWeight: 50,
    note: "道路状况良好，无特殊限制",
  },
  route5: {
    name: "新昌县城至石城镇",
    status: "closed",
    maxWidth: 0,
    maxHeight: 0,
    maxLength: 0,
    maxWeight: 0,
    note: "因山体滑坡，道路暂时关闭，预计下周恢复通行",
  },
};

// 查询表单提交处理
document.addEventListener("DOMContentLoaded", function () {
  const queryForm = document.getElementById("query-form");
  const resultMessage = document.getElementById("result-message");
  const detailInfo = document.getElementById("detail-info");
  const resultPopup = document.getElementById("result-popup");
  const closeResultBtn = document.getElementById("close-result");

  // 路段数据
  const routeData = {
    route1: {
      name: "新昌县城至镜岭镇",
      maxLength: 15,
      maxWidth: 3.2,
      maxHeight: 4.2,
      maxWeight: 55,
      restrictions: ["部分路段限高4.2米", "转弯半径较小", "部分路段限重55吨"],
      tips: ["注意镜岭镇入口处限高架", "提前申请通行证"],
    },
    route2: {
      name: "新昌县城至大市聚镇",
      maxLength: 18,
      maxWidth: 3.5,
      maxHeight: 4.5,
      maxWeight: 60,
      restrictions: ["部分桥梁限重60吨", "限宽3.5米"],
      tips: ["大市聚镇区域内行驶需特别注意路宽"],
    },
    route3: {
      name: "新昌县城至南明山景区",
      maxLength: 12,
      maxWidth: 2.8,
      maxHeight: 3.8,
      maxWeight: 45,
      restrictions: ["山路弯多坡陡", "限高3.8米", "限重45吨"],
      tips: ["雨天谨慎通行", "不建议夜间通行"],
    },
    route4: {
      name: "新昌县城至嵊州市区",
      maxLength: 20,
      maxWidth: 4.0,
      maxHeight: 4.5,
      maxWeight: 65,
      restrictions: ["104国道部分路段施工", "限速80km/h"],
      tips: ["避开早晚高峰期", "关注实时路况信息"],
    },
    route5: {
      name: "新昌县城至石城镇",
      maxLength: 16,
      maxWidth: 3.3,
      maxHeight: 4.3,
      maxWeight: 58,
      restrictions: ["部分隧道限高4.3米", "限宽3.3米"],
      tips: ["部分路段监控严格，严格控制车速"],
    },
  };

  // 关闭结果弹窗的事件处理
  if (closeResultBtn) {
    closeResultBtn.addEventListener("click", function () {
      resultPopup.classList.remove("active");
    });
  }

  // 表单验证和提交处理
  if (queryForm) {
    queryForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // 获取表单数据
      const vehicleLength = parseFloat(
        document.getElementById("vehicle-length").value
      );
      const vehicleWidth = parseFloat(
        document.getElementById("vehicle-width").value
      );
      const vehicleHeight = parseFloat(
        document.getElementById("vehicle-height").value
      );
      const vehicleWeight = parseFloat(
        document.getElementById("vehicle-weight").value
      );
      const routeSelect = document.getElementById("route-select").value;

      // 检查是否选择了路段
      if (!routeSelect) {
        showResult("error", "请选择一个路段");
        resultPopup.classList.add("active");
        return;
      }

      // 获取所选路段的数据
      const route = routeData[routeSelect];

      // 分析车辆是否可以通行
      const canPass = analyzeRoute(
        vehicleLength,
        vehicleWidth,
        vehicleHeight,
        vehicleWeight,
        route
      );

      // 显示结果
      if (canPass.pass) {
        showResult(
          "success",
          `<strong>可以通行</strong>：${route.name}`,
          canPass,
          route
        );
      } else {
        showResult(
          "error",
          `<strong>不能通行</strong>：${route.name}`,
          canPass,
          route
        );
      }

      // 显示弹出窗口
      resultPopup.classList.add("active");

      // 添加结果卡片显示动画
      const resultCard = document.getElementById("result-card");
      resultCard.classList.add("result-highlight");
      setTimeout(() => {
        resultCard.classList.remove("result-highlight");
      }, 1000);

      // 滚动到结果区域
      resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // 分析路线是否可以通行
  function analyzeRoute(length, width, height, weight, route) {
    const result = { pass: true, problems: [], suggestions: [] };

    // 检查尺寸和重量是否超限
    if (length > route.maxLength) {
      result.pass = false;
      result.problems.push(
        `车辆长度(${length}米)超过路段限制(${route.maxLength}米)`
      );
    }

    if (width > route.maxWidth) {
      result.pass = false;
      result.problems.push(
        `车辆宽度(${width}米)超过路段限制(${route.maxWidth}米)`
      );
    }

    if (height > route.maxHeight) {
      result.pass = false;
      result.problems.push(
        `车辆高度(${height}米)超过路段限制(${route.maxHeight}米)`
      );
    }

    if (weight > route.maxWeight) {
      result.pass = false;
      result.problems.push(
        `车辆重量(${weight}吨)超过路段限制(${route.maxWeight}吨)`
      );
    }

    // 添加通行建议
    if (!result.pass) {
      result.suggestions.push("考虑选择其他路线或调整运输方案");
      result.suggestions.push("联系交通部门咨询特殊通行许可");
    } else {
      // 即使可以通行也添加一些提示
      if (length > route.maxLength * 0.8) {
        result.suggestions.push("车辆长度接近限制，请谨慎驾驶");
      }
      if (width > route.maxWidth * 0.8) {
        result.suggestions.push("车辆宽度接近限制，注意狭窄路段");
      }
      if (height > route.maxHeight * 0.8) {
        result.suggestions.push("车辆高度接近限制，注意限高设施");
      }
      if (weight > route.maxWeight * 0.8) {
        result.suggestions.push("车辆重量接近限制，注意限重路段和桥梁");
      }
    }

    // 添加路段特殊提示
    route.tips.forEach((tip) => {
      result.suggestions.push(tip);
    });

    return result;
  }

  // 显示结果
  function showResult(type, message, analysis = null, route = null) {
    // 更新结果消息
    resultMessage.innerHTML = "";

    // 创建结果图标
    const icon = document.createElement("div");
    icon.className = `result-icon ${type}-icon`;
    icon.innerHTML =
      type === "success"
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-exclamation-triangle-fill"></i>';

    // 创建结果文本
    const text = document.createElement("div");
    text.className = "result-text";
    text.innerHTML = message;

    // 添加到结果容器
    resultMessage.appendChild(icon);
    resultMessage.appendChild(text);
    resultMessage.className = `result-message ${type}`;

    // 如果有详细分析，则更新详细信息
    if (analysis && route) {
      updateDetailInfo(analysis, route);
    } else {
      detailInfo.innerHTML = "";
    }
  }

  // 更新详细信息
  function updateDetailInfo(analysis, route) {
    detailInfo.innerHTML = "";

    // 创建详细信息卡片
    const card = document.createElement("div");
    card.className = "detail-card";

    // 添加路段限制信息
    const restrictionsSection = document.createElement("div");
    restrictionsSection.className = "detail-section";

    const restrictionsTitle = document.createElement("h4");
    restrictionsTitle.textContent = "路段限制";
    restrictionsSection.appendChild(restrictionsTitle);

    const restrictionsList = document.createElement("ul");
    route.restrictions.forEach((restriction) => {
      const item = document.createElement("li");
      item.textContent = restriction;
      restrictionsList.appendChild(item);
    });
    restrictionsSection.appendChild(restrictionsList);
    card.appendChild(restrictionsSection);

    // 如果有问题，显示问题列表
    if (analysis.problems.length > 0) {
      const problemsSection = document.createElement("div");
      problemsSection.className = "detail-section";

      const problemsTitle = document.createElement("h4");
      problemsTitle.textContent = "检测到的问题";
      problemsSection.appendChild(problemsTitle);

      const problemsList = document.createElement("ul");
      problemsList.className = "problems-list";
      analysis.problems.forEach((problem) => {
        const item = document.createElement("li");
        item.textContent = problem;
        problemsList.appendChild(item);
      });
      problemsSection.appendChild(problemsList);
      card.appendChild(problemsSection);
    }

    // 添加建议信息
    if (analysis.suggestions.length > 0) {
      const suggestionsSection = document.createElement("div");
      suggestionsSection.className = "detail-section";

      const suggestionsTitle = document.createElement("h4");
      suggestionsTitle.textContent = "通行建议";
      suggestionsSection.appendChild(suggestionsTitle);

      const suggestionsList = document.createElement("ul");
      suggestionsList.className = "suggestions-list";
      analysis.suggestions.forEach((suggestion) => {
        const item = document.createElement("li");
        item.textContent = suggestion;
        suggestionsList.appendChild(item);
      });
      suggestionsSection.appendChild(suggestionsList);
      card.appendChild(suggestionsSection);
    }

    // 添加联系信息
    const contactSection = document.createElement("div");
    contactSection.className = "detail-section contact-info-section";

    const contactText = document.createElement("p");
    contactText.innerHTML =
      "如需更多帮助，请联系我们: <strong>0575-12328</strong> 或访问 <a href='#contact'>联系我们</a> 页面";
    contactSection.appendChild(contactText);
    card.appendChild(contactSection);

    // 添加到详细信息容器
    detailInfo.appendChild(card);
  }
});

// 检查是否可以通行
function checkCanPass(length, width, height, weight, route) {
  // 如果路段关闭，直接返回不能通行
  if (route.status === "closed") {
    return {
      pass: false,
      reason: "道路暂时关闭",
      details: route.note,
    };
  }

  // 检查尺寸限制
  if (width > route.maxWidth) {
    return {
      pass: false,
      reason: "车辆宽度超限",
      details: `您的车辆宽度为 ${width} 米，超过了路段限制的 ${route.maxWidth} 米`,
    };
  }

  if (height > route.maxHeight) {
    return {
      pass: false,
      reason: "车辆高度超限",
      details: `您的车辆高度为 ${height} 米，超过了路段限制的 ${route.maxHeight} 米`,
    };
  }

  if (length > route.maxLength) {
    return {
      pass: false,
      reason: "车辆长度超限",
      details: `您的车辆长度为 ${length} 米，超过了路段限制的 ${route.maxLength} 米`,
    };
  }

  if (weight > route.maxWeight) {
    return {
      pass: false,
      reason: "车辆重量超限",
      details: `您的车辆重量为 ${weight} 吨，超过了路段限制的 ${route.maxWeight} 吨`,
    };
  }

  // 检查路况状态
  if (route.status === "construction") {
    // 施工路段特殊情况处理
    if (width > route.maxWidth * 0.8 || height > route.maxHeight * 0.8) {
      return {
        pass: false,
        reason: "道路施工，大型车辆通行受限",
        details: `当前路段正在施工，${route.note}，车辆宽度和高度需要小于正常限制的80%`,
      };
    }
  }

  if (route.status === "congestion") {
    // 拥堵路段特殊情况处理
    if (length > route.maxLength * 0.9) {
      return {
        pass: false,
        reason: "道路拥堵，长车辆通行困难",
        details: `当前路段交通拥堵，${route.note}，较长车辆可能无法顺利通行`,
      };
    }
  }

  // 通过所有检查，可以通行
  return {
    pass: true,
    reason: "车辆符合通行条件",
    details: `您的车辆满足路段 "${route.name}" 的所有通行要求`,
  };
}

// 获取路况状态文本描述
function getStatusText(status) {
  const statusMap = {
    normal: '<span class="status normal">正常通行</span>',
    construction: '<span class="status construction">道路施工</span>',
    congestion: '<span class="status congestion">交通拥堵</span>',
    closed: '<span class="status closed">道路关闭</span>',
  };

  return statusMap[status] || status;
}

// 获取通行建议
function getSuggestion(reason, route) {
  if (route.status === "closed") {
    return `该路段目前处于关闭状态，建议您选择其他替代路线或等待道路恢复通行。如需了解最新路况，请联系交通运输部门。`;
  }

  if (reason.includes("宽度超限")) {
    return `您的车辆宽度超过了路段限制。建议您：1. 申请特殊通行证；2. 选择宽度限制较大的替代路线；3. 或联系我们获取专业指导。`;
  }

  if (reason.includes("高度超限")) {
    return `您的车辆高度超过了路段限制。建议您：1. 检查是否可以调整货物装载方式降低高度；2. 选择高度限制较大的替代路线；3. 或联系我们获取专业指导。`;
  }

  if (reason.includes("长度超限")) {
    return `您的车辆长度超过了路段限制。建议您：1. 考虑使用长度较短的车辆；2. 分批次运输；3. 选择长度限制较大的替代路线；4. 或联系我们获取专业指导。`;
  }

  if (reason.includes("重量超限")) {
    return `您的车辆重量超过了路段限制。建议您：1. 减少装载量；2. 分批次运输；3. 选择承重能力较强的替代路线；4. 或联系我们获取专业指导。`;
  }

  if (reason.includes("道路施工")) {
    return `该路段正在进行道路施工，大型车辆通行受限。建议您：1. 选择其他替代路线；2. 等待施工完成后再通行；3. 或联系交通部门了解是否有临时通行可能。`;
  }

  if (reason.includes("道路拥堵")) {
    return `该路段当前交通拥堵，较长车辆通行困难。建议您：1. 避开交通高峰期；2. 选择其他替代路线；3. 或联系交通管理部门了解最新路况信息。`;
  }

  return `您的车辆不满足该路段的通行条件。建议您联系交通运输部门获取更详细的指导，或者考虑调整车辆参数、选择其他路线。`;
}
