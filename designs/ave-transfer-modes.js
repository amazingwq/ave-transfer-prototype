(() => {
  const modeFromPage = window.AVE_TRANSFER_MODE || "transfer";
  const root = document.getElementById("root");
  const urlParams = new URLSearchParams(window.location.search);
  const partialScenario = window.AVE_SUBMIT_RESULT_VARIANT === "partial"
    || urlParams.get("scenario") === "partial"
    || urlParams.get("result") === "partial"
    || /-partial\.html$/.test(window.location.pathname);

  const pageLinks = partialScenario
    ? {
      transfer: "ave-transfer-one-to-one.html",
      collect: "ave-transfer-many-to-one.html?scenario=partial",
      distribute: "ave-transfer-one-to-many.html?scenario=partial"
    }
    : {
      transfer: "ave-transfer-one-to-one.html",
      collect: "ave-transfer-many-to-one.html",
      distribute: "ave-transfer-one-to-many.html"
    };

  const configs = {
    transfer: {
      key: "transfer",
      tab: "转账",
      title: "一对一转账",
      badge: "ONE TO ONE",
      intro: "一个付款地址转给一个收款地址，适合日常转账。",
      typeName: "普通转账",
      sourceMulti: false,
      targetMulti: false,
      sourceTitle: "选择转出方",
      targetTitle: "选择接收方",
      sourceLabel: "发起钱包",
      targetLabel: "接收钱包",
      tokenLabel: "转账代币",
      availableLabel: "可用数量",
      amountLabel: "转账数量",
      action: "转账",
      confirmAction: "确认转账",
      sourceIds: ["main"],
      targetIds: ["r1"],
      amount: "0.019295",
      percent: 100
    },
    collect: {
      key: "collect",
      tab: "归集",
      title: "多对一归集",
      badge: "MANY TO ONE",
      intro: "多个付款地址归集到一个收款地址，适合整理分散资产。",
      typeName: "归集转账",
      sourceMulti: true,
      targetMulti: false,
      sourceTitle: "选择转出方",
      targetTitle: "选择接收方",
      sourceLabel: "发起钱包",
      targetLabel: "接收钱包",
      tokenLabel: "归集代币",
      availableLabel: "可归集数量",
      amountLabel: "归集数量",
      action: "归集",
      confirmAction: "确认归集",
      sourceIds: ["main", "chain02", "bot01"],
      targetIds: ["vault"],
      amount: "0.0193",
      percent: 100
    },
    distribute: {
      key: "distribute",
      tab: "分发",
      title: "一对多分发",
      badge: "ONE TO MANY",
      intro: "一个付款地址分发到多个收款地址，适合批量打款。",
      typeName: "分发转账",
      sourceMulti: false,
      targetMulti: true,
      sourceTitle: "选择转出方",
      targetTitle: "选择接收方",
      sourceLabel: "发起钱包",
      targetLabel: "接收钱包",
      tokenLabel: "分发代币",
      availableLabel: "可分发数量",
      amountLabel: "单地址分发数量",
      action: "分发",
      confirmAction: "确认分发",
      sourceIds: ["main"],
      targetIds: ["r1", "r2", "r3"],
      amount: "0.00643",
      percent: 100
    }
  };

  const wallets = [
    {
      id: "main",
      remark: "我的主钱包",
      type: "链钱包",
      address: "0x86fe...ed1f",
      fullAddress: "0x86fe2A9B72E9c4dBC6E0f2F9358B313d8Aed1F",
      balance: { BNB: 0.0193, USDT: 128.62 },
      nativeBalance: 0.0193
    },
    {
      id: "chain02",
      remark: "链钱包 02",
      type: "链钱包",
      address: "0x7c09...77a8",
      fullAddress: "0x7c09F18dB7B8dD92437C1B4788F34f9b2D6c77a8",
      balance: { BNB: 0.0052, USDT: 42.35 },
      nativeBalance: 0.0052
    },
    {
      id: "bot01",
      remark: "托管钱包 01",
      type: "托管钱包",
      address: "0x31ac...4b09",
      fullAddress: "0x31ac8F5E431c2458B9e6dB7B4A91Aa2C044b4B09",
      balance: { BNB: 0.0121, USDT: 216.48 },
      nativeBalance: 0.0121
    },
    {
      id: "vault",
      remark: "资金归集钱包",
      type: "链钱包",
      address: "0x621a...e902",
      fullAddress: "0x621a48A74958D7D1b2FAa369bb5dC72B2D57e902",
      balance: { BNB: 0.084, USDT: 510.74 },
      nativeBalance: 0.084
    }
  ];

  const receivers = [
    {
      id: "r1",
      remark: "Wallet 3468",
      type: "链钱包",
      address: "0xda80...3468",
      fullAddress: "0xda80aB2CF7e99fE402233D4db853b0D9aA2d3468",
      balanceLabel: "BNB: 0.0052 · 余额 $3.18"
    },
    {
      id: "r2",
      remark: "Wallet a707",
      type: "链钱包",
      address: "0x4c2e...a707",
      fullAddress: "0x4c2eeE61538fD67f286cd7B8d15Daf2C9C71a707",
      balanceLabel: "BNB: 0 · 余额 $0.00"
    },
    {
      id: "r3",
      remark: "Wallet 59d4",
      type: "链钱包",
      address: "0x50aa...59d4",
      fullAddress: "0x50aa297AaD2F8486bF21a042c4187048dEec59d4",
      balanceLabel: "BNB: 0.0121 · 余额 $7.41"
    },
    {
      id: "r4",
      remark: "Axon 备用地址",
      type: "地址本",
      address: "0x21e0...9012",
      fullAddress: "0x21e04A6a0f3116D1199b4ad128A742Bc15c19012",
      balanceLabel: "备注：常用收款"
    },
    {
      id: "r5",
      remark: "合约测试地址",
      type: "合约地址",
      address: "0xb93e...0c18",
      fullAddress: "0xb93e4197A51D9e9604fE333B7445574281300c18",
      balanceLabel: "备注：内部测试",
      isContract: true
    }
  ];

  const tokens = [
    { id: "bnb", symbol: "BNB", name: "BNB", network: "BSC", price: 612.35, chainBadge: "B" },
    { id: "usdt", symbol: "USDT", name: "Tether USD", network: "BSC", price: 1, chainBadge: "B" }
  ];

  const gasOptions = {
    slow: { name: "慢", value: 0.00000421, usd: "$0.00258" },
    recommend: { name: "推荐", value: 0.00000546, usd: "$0.00334" },
    fast: { name: "快", value: 0.00000672, usd: "$0.00411" }
  };

  const txHash = "0x974f30d851b2E8c38E413680b2D2D2608F0d26c32";
  const mode = configs[modeFromPage] ? modeFromPage : "transfer";
  const config = configs[mode];
  const initialScreen = window.AVE_START_SCREEN || "operate";
  const initialResultVariant = window.AVE_RESULT_VARIANT || "success";
  const submitResultVariant = partialScenario && ["collect", "distribute"].includes(mode)
    ? "partial"
    : window.AVE_SUBMIT_RESULT_VARIANT || "success";
  const state = {
    screen: initialScreen,
    tokenId: "bnb",
    amount: config.amount,
    percent: config.percent,
    sourceIds: [...config.sourceIds],
    targetIds: [...config.targetIds],
    draftIds: [],
    sheetRole: "",
    gas: "recommend",
    expandedSource: false,
    expandedTarget: false,
    resultVariant: initialResultVariant,
    toast: "",
    processing: false
  };

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fmt(num, digits = 6) {
    const n = Number(num || 0);
    return n.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
  }

  function token() {
    return tokens.find(item => item.id === state.tokenId) || tokens[0];
  }

  function gas() {
    return gasOptions[state.gas] || gasOptions.recommend;
  }

  function amountNum() {
    return Number(state.amount) || 0;
  }

  function sourcePool() {
    return wallets.filter(item => item.id !== "vault");
  }

  function targetPool() {
    return config.key === "collect" ? wallets : receivers;
  }

  function byIds(pool, ids) {
    return ids.map(id => pool.find(item => item.id === id)).filter(Boolean);
  }

  function sources() {
    return byIds(sourcePool(), state.sourceIds);
  }

  function targets() {
    return byIds(targetPool(), state.targetIds);
  }

  function displayName(item) {
    return item?.remark || item?.address || "未选择";
  }

  function entityLine(item) {
    if (!item) return "";
    return `<span class="detail-inline"><span>${esc(displayName(item))}</span><span class="tag">${esc(item.type)}</span></span>`;
  }

  function availableAmount() {
    const t = token();
    const list = sources();
    if (config.key === "collect") {
      return list.reduce((sum, item) => sum + Number(item.balance[t.symbol] || 0), 0);
    }
    return Number(list[0]?.balance[t.symbol] || 0);
  }

  function totalAmount() {
    if (config.key === "distribute") return amountNum() * Math.max(targets().length, 1);
    return amountNum();
  }

  function resultList() {
    return config.key === "collect" ? sources() : targets();
  }

  function perResultAmount() {
    if (config.key === "distribute") return amountNum();
    if (config.key === "collect") return amountNum() / Math.max(sources().length, 1);
    return amountNum();
  }

  function networkFee() {
    if (config.key === "collect") return gas().value * Math.max(sources().length, 1);
    return gas().value;
  }

  function networkFeeLabel() {
    const fee = networkFee();
    const usd = fee * 612.35;
    return `${fmt(fee, 8)} BNB ≈ $${usd.toFixed(5)}`;
  }

  function heroAmount() {
    if (isPartialFailure()) return `-${fmt(successAmount(), 6)} ${token().symbol}`;
    return `-${fmt(totalAmount(), 6)} ${token().symbol}`;
  }

  function isPartialFailure() {
    return ["collect", "distribute"].includes(config.key) && state.resultVariant === "partial";
  }

  function failedResultItems() {
    if (!isPartialFailure()) return [];
    const list = resultList();
    return list.length ? [list[list.length - 1]] : [];
  }

  function successResultItems() {
    const failedIds = new Set(failedResultItems().map(item => item.id));
    return resultList().filter(item => !failedIds.has(item.id));
  }

  function successAmount() {
    if (!isPartialFailure()) return totalAmount();
    return perResultAmount() * successResultItems().length;
  }

  function failedAmount() {
    return perResultAmount() * failedResultItems().length;
  }

  function shortHash() {
    return `${txHash.slice(0, 6)}...${txHash.slice(-6)}`;
  }

  function showToast(message) {
    state.toast = message;
    render();
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      state.toast = "";
      render();
    }, 1600);
  }

  function render() {
    root.innerHTML = shell(
      state.screen === "confirm"
        ? confirmPage()
        : state.screen === "result"
          ? resultPage()
          : operatePage()
    );

    if (state.sheetRole) root.querySelector(".app").insertAdjacentHTML("beforeend", selectorSheet());
    if (state.processing) root.querySelector(".app").insertAdjacentHTML("beforeend", processingLayer());
    if (state.toast) root.querySelector(".app").insertAdjacentHTML("beforeend", `<div class="toast">${esc(state.toast)}</div>`);
  }

  function shell(inner) {
    return `
      <main class="prototype">
        <aside class="intro">
          <span class="intro-badge">${config.badge}</span>
          <h1>Ave ${config.title}</h1>
          <p>${config.intro} 首页沿用 Ave 之前的卡片式转账结构，只新增「转账 / 归集 / 分发」模式入口。</p>
          <div class="intro-card">
            <h2>设计重点</h2>
            <ul>
              <li>三种模式并列，但每个 HTML 可单独打开。</li>
              <li>地址区只展示备注，没备注才展示地址。</li>
              <li>提交前后都保留网络、金额、地址和费用确认。</li>
            </ul>
          </div>
        </aside>

        <section class="phone-col">
          <div class="live"><span>LIVE</span> ${config.title}原型</div>
          <div class="phone">
            <div class="screen">
              <div class="status">
                <div>10:29</div>
                <div class="signal">VPN&nbsp; 5G <span class="battery">100</span></div>
              </div>
              <div class="app">${inner}</div>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  function nav(title, wallet = false) {
    const action = state.screen === "operate" ? "toast-home" : "back-operate";
    return `
      <div class="nav">
        <button class="back" data-action="${action}" aria-label="返回">‹</button>
        <div class="nav-title">${title}</div>
        <div>${wallet ? `<div class="nav-wallet"><span class="coin">BNB</span></div>` : ""}</div>
      </div>
    `;
  }

  function operatePage() {
    return `
      ${nav(config.action)}
      <div class="scroll transfer-scroll">
        ${operationTabs()}
        <div class="section-title">${config.tokenLabel}</div>
        ${tokenCard()}

        <div class="section-title">${config.action}路径</div>
        ${routeCard()}

        <div class="section-title">${config.amountLabel}</div>
        ${amountCard()}

        <div class="section-title">
          <span>矿工费</span>
          <small>${token().network} · Gas</small>
        </div>
        ${gasGrid()}
      </div>
      <div class="bottom">
        <button class="primary" data-action="next">${config.action}</button>
      </div>
    `;
  }

  function operationTabs() {
    return `
      <div class="mode-tabs">
        ${Object.values(configs).map(item => `
          <a class="${item.key === config.key ? "active" : ""}" href="${pageLinks[item.key]}">${item.tab}</a>
        `).join("")}
      </div>
    `;
  }

  function tokenCard() {
    const t = token();
    return `
      <button class="card token-card selectable-card" data-action="open-sheet" data-role="token">
        <span class="coin">${t.symbol.slice(0, 4)}<span class="chain-corner">${t.chainBadge}</span></span>
        <span>
          <span class="name">${t.symbol}</span>
          <span class="sub">${t.network} 网络 · ${t.name}</span>
        </span>
        <span class="chevron">›</span>
      </button>
    `;
  }

  function routeCard() {
    return `
      <div class="card route-card">
        ${pathRow("source")}
        <div class="path-arrow">↓</div>
        ${pathRow("target")}
      </div>
    `;
  }

  function pathRow(role) {
    const multi = role === "source" ? config.sourceMulti : config.targetMulti;
    const list = role === "source" ? sources() : targets();
    const title = role === "source" ? "付款地址" : "收款地址";
    const picker = role === "source" ? config.sourceTitle : config.targetTitle;
    const actionText = list.length ? "切换" : "选择";
    return `
      <div class="path-row">
        <div class="path-label">${title}</div>
        <div class="path-content">
          ${list.length ? selectedSummary(list, multi) : `<div class="path-main"><span class="path-name">${picker}</span></div>`}
        </div>
        <button class="path-action" data-action="open-sheet" data-role="${role}">${actionText}</button>
      </div>
    `;
  }

  function selectedSummary(list, multi) {
    if (multi) {
      const names = list.map(displayName).join("、");
      return `
        <div class="path-main">
          <span class="path-name">${list.length} 个地址</span>
        </div>
        <div class="path-meta">${esc(names)}</div>
      `;
    }
    const item = list[0];
    return `
      <div class="path-main">
        <span class="path-name">${esc(displayName(item))}</span>
        <span class="tag">${esc(item.type || "地址")}</span>
      </div>
      <div class="path-meta">${esc(item.address || "")}</div>
    `;
  }

  function amountCard() {
    const t = token();
    return `
      <div class="card amount-card">
        <div class="amount-input-row">
          <div class="amount-main">
            <input id="amountInput" class="amount-input" value="${esc(state.amount)}" inputmode="decimal" placeholder="0" />
            ${amountNum() ? `<span class="amount-usd">≈ $${(amountNum() * t.price).toFixed(2)}</span>` : ""}
          </div>
          <span class="unit">${t.symbol}</span>
          <button class="max-btn" data-action="max">最大</button>
        </div>
        <div class="balance-row">
          <span>${config.availableLabel}</span>
          <strong>${fmt(availableAmount(), 6)} ${t.symbol}</strong>
        </div>
      </div>
    `;
  }

  function gasGrid() {
    return `
      <div class="gas-grid">
        ${Object.entries(gasOptions).map(([key, item]) => `
          <button class="gas-card ${state.gas === key ? "active" : ""}" data-gas="${key}">
            <div class="gas-name">${item.name}</div>
            <strong>${fmt(item.value, 8)}</strong>
            <small>BNB · ≈ ${item.usd}</small>
          </button>
        `).join("")}
      </div>
    `;
  }

  function confirmPage() {
    return `
      ${nav(`${config.action}详情`)}
      <div class="scroll detail-scroll">
        <div class="hint danger">重要提示：请确认收款地址、网络和金额。链上提交后不可撤回。</div>
        <div class="detail-hero-card">
          <div class="label-small">${config.typeName}</div>
          <div class="big">${heroAmount()}</div>
        </div>

        <div class="section-title">${config.action}明细</div>
        <div class="summary-card">
          <div class="summary-row"><span>转账网络</span><strong>${token().network}</strong></div>
          ${addressRows("source", state.expandedSource)}
          ${addressRows("target", state.expandedTarget)}
          <div class="summary-row"><span>${config.tokenLabel}</span><strong>${token().symbol}</strong></div>
          ${amountRows()}
          <div class="summary-row"><span>预计手续费</span><strong>${networkFeeLabel()}</strong></div>
        </div>
      </div>
      <div class="bottom">
        <button class="primary" data-action="confirm-transfer">${config.confirmAction}</button>
      </div>
    `;
  }

  function amountRows() {
    const t = token();
    if (config.key === "distribute") {
      return `
        <div class="summary-row"><span>单地址金额</span><strong>${fmt(amountNum(), 6)} ${t.symbol}</strong></div>
        <div class="summary-row"><span>总分发金额</span><strong>${fmt(totalAmount(), 6)} ${t.symbol}</strong></div>
      `;
    }
    if (config.key === "collect") {
      return `<div class="summary-row"><span>归集总额</span><strong>${fmt(totalAmount(), 6)} ${t.symbol}</strong></div>`;
    }
    return `<div class="summary-row"><span>转账金额</span><strong>${fmt(totalAmount(), 6)} ${t.symbol}</strong></div>`;
  }

  function addressRows(role, expanded) {
    const multi = role === "source" ? config.sourceMulti : config.targetMulti;
    const label = role === "source" ? "付款地址" : "收款地址";
    const list = role === "source" ? sources() : targets();
    const toggleAction = role === "source" ? "toggle-source" : "toggle-target";
    const partialResultRole = config.key === "collect" ? "source" : "target";
    const partialResultList = isPartialFailure() && role === partialResultRole;
    const showResultStatus = state.screen === "result" && multi;

    if (!multi) {
      return `<div class="summary-row"><span>${label}</span><strong>${entityLine(list[0])}</strong></div>`;
    }

    return `
      <button class="summary-row address-toggle-row" data-action="${toggleAction}" type="button">
        <span>${label}</span>
        <strong>${list.length} 个地址 · <span class="toggle-link">${expanded ? "收起" : partialResultList ? "查看结果" : "查看全部"}</span></strong>
      </button>
      ${expanded ? `<div class="address-list">${list.map((item, index) => addressListItem(item, index, showResultStatus ? resultStatusForAddress(item) : "")).join("")}</div>` : ""}
    `;
  }

  function resultStatusForAddress(item) {
    return failedResultItems().some(failed => failed.id === item.id) ? "failed" : "success";
  }

  function addressListItem(item, index, status = "") {
    const statusText = status === "failed" ? "失败" : status === "success" ? "成功" : "";
    const fullAddress = item.fullAddress || item.address || "";
    const hasRemark = Boolean(item.remark);
    const displayValue = hasRemark ? displayName(item) : fullAddress;
    const fullClass = hasRemark ? "" : " full-address";
    return `
      <div class="address-list-item">
        <div class="address-list-head">
          <span class="address-display${fullClass}">${index + 1}. ${esc(displayValue)}</span>
          <span class="address-list-actions">
            ${statusText ? `<em class="address-status ${status}">${statusText}</em>` : ""}
            <button class="mini-copy" data-copy-address="${esc(fullAddress)}">复制</button>
          </span>
        </div>
      </div>
    `;
  }

  function resultPage() {
    const partialFailure = isPartialFailure();
    return `
      ${nav("交易详情")}
      <div class="scroll result-scroll">
        <div class="result-hero ${partialFailure ? "warning" : ""}">
          <div class="result-mark">${partialFailure ? "!" : "✓"}</div>
          ${partialFailure ? `<div class="result-state">部分成功 · ${successResultItems().length} 成功 / ${failedResultItems().length} 失败</div>` : ""}
          <div class="result-amount">${heroAmount()}</div>
        </div>

        <div class="section-title">交易明细</div>
        <div class="summary-card">
          ${addressRows("source", state.expandedSource)}
          ${addressRows("target", state.expandedTarget)}
          <div class="summary-row"><span>转账网络</span><strong>${token().network}</strong></div>
          ${resultAmountRows()}
          <div class="summary-row"><span>网络手续费</span><strong>${networkFeeLabel()}</strong></div>
          <div class="summary-row"><span>交易哈希</span><strong class="inline-value"><span>${shortHash()}</span><button class="copy-btn" data-action="copy-hash">复制</button></strong></div>
          <div class="summary-row"><span>区块浏览器</span><strong><button class="link-value" data-action="toast-explorer">查看链上详情</button></strong></div>
          <div class="summary-row"><span>交易时间</span><strong>2026-06-12 10:29:41</strong></div>
        </div>
      </div>
    `;
  }

  function resultAmountRows() {
    const t = token();
    if (config.key === "distribute") {
      return `
        <div class="summary-row"><span>单地址金额</span><strong>${fmt(amountNum(), 6)} ${t.symbol}</strong></div>
        <div class="summary-row"><span>成功转出</span><strong>${fmt(successAmount(), 6)} ${t.symbol}</strong></div>
        <div class="summary-row"><span>失败未转</span><strong>${fmt(failedAmount(), 6)} ${t.symbol}</strong></div>
      `;
    }
    if (config.key === "collect") {
      return `
        <div class="summary-row"><span>单地址金额</span><strong>${fmt(perResultAmount(), 6)} ${t.symbol}</strong></div>
        <div class="summary-row"><span>成功归集</span><strong>${fmt(successAmount(), 6)} ${t.symbol}</strong></div>
        <div class="summary-row"><span>失败未归集</span><strong>${fmt(failedAmount(), 6)} ${t.symbol}</strong></div>
      `;
    }
    return `<div class="summary-row"><span>到账金额</span><strong>${fmt(totalAmount() - networkFee(), 8)} ${t.symbol}</strong></div>`;
  }

  function selectorSheet() {
    if (state.sheetRole === "token") return tokenSheet();
    const role = state.sheetRole;
    const multi = role === "source" ? config.sourceMulti : config.targetMulti;
    const pool = role === "source" ? sourcePool() : targetPool();
    const title = role === "source" ? config.sourceTitle : config.targetTitle;
    return `
      <div class="sheet-mask" data-action="close-sheet">
        <div class="sheet" data-stop>
          <div class="drag"></div>
          <div class="sheet-head">
            <div>
              <h2 class="sheet-title">${title}</h2>
              <div class="sheet-sub">${multi ? "可选择多个地址，提交后按当前金额规则执行。" : "有备注展示备注，没备注才展示地址。"}</div>
            </div>
            <button class="close" data-action="close-sheet">×</button>
          </div>
          <div class="sheet-scroll">
            <div class="list-caption">${multi ? "多选" : "单选"} · ${pool.length}</div>
            ${pool.map(item => selectRow(item, multi)).join("")}
          </div>
          <div class="sheet-bottom">
            <div class="sheet-count">已选 ${state.draftIds.length} 个地址</div>
            <button class="sheet-confirm" data-action="confirm-sheet" ${state.draftIds.length ? "" : "disabled"}>确定</button>
          </div>
        </div>
      </div>
    `;
  }

  function selectRow(item, multi) {
    const checked = state.draftIds.includes(item.id);
    return `
      <button class="select-row ${checked ? "selected" : ""}" data-pick="${item.id}" data-multi="${multi ? "1" : "0"}">
        <span class="coin dark">BNB</span>
        <span>
          <span class="name">${esc(displayName(item))}</span>
          <span class="sub">${esc(item.address)} · ${esc(item.type || "")}</span>
          <span class="sub">${esc(item.balanceLabel || `BNB: ${item.nativeBalance}`)}</span>
        </span>
        <span class="select-box">${checked ? "✓" : ""}</span>
      </button>
    `;
  }

  function tokenSheet() {
    return `
      <div class="sheet-mask" data-action="close-sheet">
        <div class="sheet" data-stop>
          <div class="drag"></div>
          <div class="sheet-head">
            <div>
              <h2 class="sheet-title">选择代币</h2>
              <div class="sheet-sub">仅展示当前网络下可操作资产。</div>
            </div>
            <button class="close" data-action="close-sheet">×</button>
          </div>
          <div class="sheet-scroll">
            ${tokens.map(item => `
              <button class="select-row ${item.id === state.tokenId ? "selected" : ""}" data-token="${item.id}">
                <span class="coin">${item.symbol.slice(0, 4)}<span class="chain-corner">${item.chainBadge}</span></span>
                <span>
                  <span class="name">${item.symbol}</span>
                  <span class="sub">${item.network} 网络 · ${item.name}</span>
                </span>
                <span class="select-box">${item.id === state.tokenId ? "✓" : ""}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function processingLayer() {
    return `
      <div class="processing">
        <div>
          <div class="spinner"></div>
          <div class="label-small">交易提交中</div>
        </div>
      </div>
    `;
  }

  function setAmountByPercent(percent) {
    state.percent = Number(percent);
    const available = availableAmount();
    const divisor = config.key === "distribute" ? Math.max(targets().length, 1) : 1;
    const value = (available * state.percent / 100) / divisor;
    state.amount = value ? fmt(value, 6) : "";
  }

  function backendPrecheck() {
    if (!sources().length) return { ok: false, message: "请先选择付款地址" };
    if (!targets().length) return { ok: false, message: "请先选择收款地址" };
    if (!amountNum()) return { ok: false, message: `请输入${config.amountLabel}` };
    if (targets().some(item => item.isContract)) {
      return { ok: false, message: "收款地址为合约地址，提交前请再次确认" };
    }
    if (totalAmount() > availableAmount()) {
      return { ok: false, message: "当前余额不足，请调整金额或地址" };
    }
    const nativeEnough = sources().every(item => Number(item.nativeBalance || 0) >= gas().value);
    if (!nativeEnough) return { ok: false, message: "部分付款地址矿工费不足" };
    return { ok: true, message: "" };
  }

  root.addEventListener("click", event => {
    if (event.target.closest("[data-stop]")) event.stopPropagation();

    const pick = event.target.closest("[data-pick]");
    if (pick) {
      const id = pick.dataset.pick;
      const multi = pick.dataset.multi === "1";
      state.draftIds = multi
        ? state.draftIds.includes(id)
          ? state.draftIds.filter(item => item !== id)
          : [...state.draftIds, id]
        : [id];
      render();
      return;
    }

    const tokenBtn = event.target.closest("[data-token]");
    if (tokenBtn) {
      state.tokenId = tokenBtn.dataset.token;
      state.sheetRole = "";
      render();
      return;
    }

    const copyAddressBtn = event.target.closest("[data-copy-address]");
    if (copyAddressBtn) {
      const address = copyAddressBtn.dataset.copyAddress || "";
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(address).catch(() => {});
      showToast("地址已复制");
      return;
    }

    const gasBtn = event.target.closest("[data-gas]");
    if (gasBtn) {
      state.gas = gasBtn.dataset.gas;
      render();
      return;
    }

    const actionBtn = event.target.closest("[data-action]");
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;

    if (action === "open-sheet") {
      const role = actionBtn.dataset.role;
      state.sheetRole = role;
      if (role === "source") state.draftIds = [...state.sourceIds];
      else if (role === "target") state.draftIds = [...state.targetIds];
      else state.draftIds = [];
      render();
    } else if (action === "close-sheet") {
      state.sheetRole = "";
      render();
    } else if (action === "confirm-sheet") {
      if (!state.draftIds.length) return showToast("请至少选择 1 个地址");
      if (state.sheetRole === "source") state.sourceIds = [...state.draftIds];
      if (state.sheetRole === "target") state.targetIds = [...state.draftIds];
      state.sheetRole = "";
      render();
    } else if (action === "max") {
      const t = token();
      const fee = t.symbol === "BNB" ? networkFee() : 0;
      const divisor = config.key === "distribute" ? Math.max(targets().length, 1) : 1;
      const max = Math.max((availableAmount() - fee) / divisor, 0);
      state.amount = max ? fmt(max, 6) : "";
      state.percent = 100;
      render();
    } else if (action === "percent-range") {
      setAmountByPercent(actionBtn.value);
      render();
    } else if (action === "next") {
      const check = backendPrecheck();
      if (!check.ok) showToast(check.message);
      state.screen = "confirm";
      render();
    } else if (action === "back-operate") {
      state.screen = "operate";
      render();
    } else if (action === "confirm-transfer") {
      state.processing = true;
      render();
      window.setTimeout(() => {
        state.processing = false;
        state.screen = "result";
        state.resultVariant = submitResultVariant;
        render();
      }, 850);
    } else if (action === "new-transfer") {
      state.screen = "operate";
      state.expandedSource = false;
      state.expandedTarget = false;
      state.resultVariant = "success";
      render();
    } else if (action === "retry-failed") {
      state.screen = "operate";
      if (config.key === "collect") state.sourceIds = failedResultItems().map(item => item.id);
      else state.targetIds = failedResultItems().map(item => item.id);
      state.expandedSource = false;
      state.expandedTarget = false;
      state.resultVariant = "success";
      showToast("已带入失败地址，可重新确认后提交");
    } else if (action === "toggle-source") {
      state.expandedSource = !state.expandedSource;
      render();
    } else if (action === "toggle-target") {
      state.expandedTarget = !state.expandedTarget;
      render();
    } else if (action === "copy-hash") {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txHash).catch(() => {});
      showToast("哈希值已复制");
    } else if (action === "toast-explorer") {
      showToast("正在打开 BSC 区块浏览器");
    } else if (action === "toast-records") {
      showToast("跳转到账单 / 动态 Tab");
    } else if (action === "toast-home") {
      showToast("返回钱包页");
    }
  });

  root.addEventListener("input", event => {
    if (event.target.id === "amountInput") {
      state.amount = event.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
      const available = availableAmount();
      const divisor = config.key === "distribute" ? Math.max(targets().length, 1) : 1;
      const base = available / divisor;
      state.percent = base ? Math.min(100, Math.round((amountNum() / base) * 100)) : 0;
      render();
      const input = root.querySelector("#amountInput");
      if (input) input.focus({ preventScroll: true });
    }
    if (event.target.classList.contains("range")) {
      setAmountByPercent(event.target.value);
      render();
    }
  });

  render();
})();
