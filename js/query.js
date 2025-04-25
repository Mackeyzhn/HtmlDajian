// 路况数据 (这里是模拟数据，实际应用中应从服务器获取)
const roadConditions = {
  route1: {
    name: "新昌县城至镜岭镇",
    status: "normal", // normal, construction, congestion, closed
    maxWidth: 4.5,
    maxHeight: 4.5,
    maxLength: 12,
    maxWeight: 40,
    note: "道路状况良好，无特殊限制"
  },
  route2: {
    name: "新昌县城至大市聚镇",
    status: "construction",
    maxWidth: 4,
    maxHeight: 4.5,
    maxLength: 10,
    maxWeight: 35,
    note: "部分路段正在进行道路维修，通行受限"
  },
  route3: {
    name: "新昌县城至南明山景区",
    status: "congestion",
    maxWidth: 3.5,
    maxHeight: 4,
    maxLength: 9,
    maxWeight: 30,
    note: "景区道路较窄，且游客较多，通行缓慢"
  },
  route4: {
    name: "新昌县城至嵊州市区",
    status: "normal",
    maxWidth: 5,
    maxHeight: 5,
    maxLength: 15,
    maxWeight: 50,
    note: "道路状况良好，无特殊限制"
  },
  route5: {
    name: "新昌县城至石城镇",
    status: "closed",
    maxWidth: 0,
    maxHeight: 0,
    maxLength: 0,
    maxWeight: 0,
    note: "因山体滑坡，道路暂时关闭，预计下周恢复通行"
  }
};

// 查询表单提交处理
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('transport-form');
  const resultMessage = document.getElementById('result-message');
  const detailInfo = document.getElementById('detail-info');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取用户输入的车辆信息
      const vehicleLength = parseFloat(document.getElementById('vehicle-length').value);
      const vehicleWidth = parseFloat(document.getElementById('vehicle-width').value);
      const vehicleHeight = parseFloat(document.getElementById('vehicle-height').value);
      const vehicleWeight = parseFloat(document.getElementById('vehicle-weight').value);
      const routeId = document.getElementById('route-select').value;
      
      // 验证输入是否有效
      if (isNaN(vehicleLength) || isNaN(vehicleWidth) || isNaN(vehicleHeight) || isNaN(vehicleWeight) || !routeId) {
        showResult('error', '请输入有效的车辆信息并选择路段');
        return;
      }
      
      // 获取选择的路段信息
      const route = roadConditions[routeId];
      
      // 判断是否可以通行
      const canPass = checkCanPass(vehicleLength, vehicleWidth, vehicleHeight, vehicleWeight, route);
      
      // 显示结果
      showResultDetails(canPass, vehicleLength, vehicleWidth, vehicleHeight, vehicleWeight, route);
    });
  }
});

// 检查是否可以通行
function checkCanPass(length, width, height, weight, route) {
  // 如果路段关闭，直接返回不能通行
  if (route.status === 'closed') {
    return {
      pass: false,
      reason: '道路暂时关闭',
      details: route.note
    };
  }
  
  // 检查尺寸限制
  if (width > route.maxWidth) {
    return {
      pass: false,
      reason: '车辆宽度超限',
      details: `您的车辆宽度为 ${width} 米，超过了路段限制的 ${route.maxWidth} 米`
    };
  }
  
  if (height > route.maxHeight) {
    return {
      pass: false,
      reason: '车辆高度超限',
      details: `您的车辆高度为 ${height} 米，超过了路段限制的 ${route.maxHeight} 米`
    };
  }
  
  if (length > route.maxLength) {
    return {
      pass: false,
      reason: '车辆长度超限',
      details: `您的车辆长度为 ${length} 米，超过了路段限制的 ${route.maxLength} 米`
    };
  }
  
  if (weight > route.maxWeight) {
    return {
      pass: false,
      reason: '车辆重量超限',
      details: `您的车辆重量为 ${weight} 吨，超过了路段限制的 ${route.maxWeight} 吨`
    };
  }
  
  // 检查路况状态
  if (route.status === 'construction') {
    // 施工路段特殊情况处理
    if (width > route.maxWidth * 0.8 || height > route.maxHeight * 0.8) {
      return {
        pass: false,
        reason: '道路施工，大型车辆通行受限',
        details: `当前路段正在施工，${route.note}，车辆宽度和高度需要小于正常限制的80%`
      };
    }
  }
  
  if (route.status === 'congestion') {
    // 拥堵路段特殊情况处理
    if (length > route.maxLength * 0.9) {
      return {
        pass: false,
        reason: '道路拥堵，长车辆通行困难',
        details: `当前路段交通拥堵，${route.note}，较长车辆可能无法顺利通行`
      };
    }
  }
  
  // 通过所有检查，可以通行
  return {
    pass: true,
    reason: '车辆符合通行条件',
    details: `您的车辆满足路段 "${route.name}" 的所有通行要求`
  };
}

// 显示查询结果
function showResult(type, message) {
  const resultMessage = document.getElementById('result-message');
  const detailInfo = document.getElementById('detail-info');
  
  resultMessage.innerHTML = '';
  detailInfo.innerHTML = '';
  
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  
  if (type === 'success') {
    messageElement.className = 'success-message';
  } else if (type === 'error') {
    messageElement.className = 'error-message';
  } else if (type === 'warning') {
    messageElement.className = 'warning-message';
  }
  
  resultMessage.appendChild(messageElement);
}

// 显示详细结果
function showResultDetails(result, length, width, height, weight, route) {
  const resultMessage = document.getElementById('result-message');
  const detailInfo = document.getElementById('detail-info');
  
  resultMessage.innerHTML = '';
  detailInfo.innerHTML = '';
  
  // 创建结果消息
  const messageElement = document.createElement('div');
  messageElement.className = result.pass ? 'success-message' : 'error-message';
  
  const iconElement = document.createElement('i');
  iconElement.className = result.pass ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill';
  messageElement.appendChild(iconElement);
  
  const textElement = document.createElement('span');
  textElement.textContent = result.pass ? '可以通行' : '不能通行';
  messageElement.appendChild(textElement);
  
  resultMessage.appendChild(messageElement);
  
  // 创建详细信息
  const reasonElement = document.createElement('p');
  reasonElement.innerHTML = `<strong>原因：</strong>${result.reason}`;
  detailInfo.appendChild(reasonElement);
  
  const detailsElement = document.createElement('p');
  detailsElement.innerHTML = `<strong>详情：</strong>${result.details}`;
  detailInfo.appendChild(detailsElement);
  
  // 路段信息
  const routeInfoElement = document.createElement('div');
  routeInfoElement.className = 'route-info';
  routeInfoElement.innerHTML = `
    <h4>路段信息：${route.name}</h4>
    <ul>
      <li><strong>路况状态：</strong>${getStatusText(route.status)}</li>
      <li><strong>最大宽度限制：</strong>${route.maxWidth} 米</li>
      <li><strong>最大高度限制：</strong>${route.maxHeight} 米</li>
      <li><strong>最大长度限制：</strong>${route.maxLength} 米</li>
      <li><strong>最大重量限制：</strong>${route.maxWeight} 吨</li>
      <li><strong>备注：</strong>${route.note}</li>
    </ul>
  `;
  detailInfo.appendChild(routeInfoElement);
  
  // 添加车辆信息
  const vehicleInfoElement = document.createElement('div');
  vehicleInfoElement.className = 'vehicle-info';
  vehicleInfoElement.innerHTML = `
    <h4>您的车辆信息</h4>
    <ul>
      <li><strong>长度：</strong>${length} 米</li>
      <li><strong>宽度：</strong>${width} 米</li>
      <li><strong>高度：</strong>${height} 米</li>
      <li><strong>重量：</strong>${weight} 吨</li>
    </ul>
  `;
  detailInfo.appendChild(vehicleInfoElement);
  
  // 添加建议信息
  if (!result.pass) {
    const suggestionElement = document.createElement('div');
    suggestionElement.className = 'suggestion';
    suggestionElement.innerHTML = `
      <h4>通行建议</h4>
      <p>${getSuggestion(result.reason, route)}</p>
    `;
    detailInfo.appendChild(suggestionElement);
  }
  
  // 让结果卡片可见并滚动到结果
  const resultCard = document.getElementById('result-card');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 获取路况状态文本描述
function getStatusText(status) {
  const statusMap = {
    'normal': '<span class="status normal">正常通行</span>',
    'construction': '<span class="status construction">道路施工</span>',
    'congestion': '<span class="status congestion">交通拥堵</span>',
    'closed': '<span class="status closed">道路关闭</span>'
  };
  
  return statusMap[status] || status;
}

// 获取通行建议
function getSuggestion(reason, route) {
  if (route.status === 'closed') {
    return `该路段目前处于关闭状态，建议您选择其他替代路线或等待道路恢复通行。如需了解最新路况，请联系交通运输部门。`;
  }
  
  if (reason.includes('宽度超限')) {
    return `您的车辆宽度超过了路段限制。建议您：1. 申请特殊通行证；2. 选择宽度限制较大的替代路线；3. 或联系我们获取专业指导。`;
  }
  
  if (reason.includes('高度超限')) {
    return `您的车辆高度超过了路段限制。建议您：1. 检查是否可以调整货物装载方式降低高度；2. 选择高度限制较大的替代路线；3. 或联系我们获取专业指导。`;
  }
  
  if (reason.includes('长度超限')) {
    return `您的车辆长度超过了路段限制。建议您：1. 考虑使用长度较短的车辆；2. 分批次运输；3. 选择长度限制较大的替代路线；4. 或联系我们获取专业指导。`;
  }
  
  if (reason.includes('重量超限')) {
    return `您的车辆重量超过了路段限制。建议您：1. 减少装载量；2. 分批次运输；3. 选择承重能力较强的替代路线；4. 或联系我们获取专业指导。`;
  }
  
  if (reason.includes('道路施工')) {
    return `该路段正在进行道路施工，大型车辆通行受限。建议您：1. 选择其他替代路线；2. 等待施工完成后再通行；3. 或联系交通部门了解是否有临时通行可能。`;
  }
  
  if (reason.includes('道路拥堵')) {
    return `该路段当前交通拥堵，较长车辆通行困难。建议您：1. 避开交通高峰期；2. 选择其他替代路线；3. 或联系交通管理部门了解最新路况信息。`;
  }
  
  return `您的车辆不满足该路段的通行条件。建议您联系交通运输部门获取更详细的指导，或者考虑调整车辆参数、选择其他路线。`;
}