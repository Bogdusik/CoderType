const t = [{
    label: "Linux Kernel",
    url: "https://github.com/torvalds/linux",
    files: [{
        path: "/linux/kernel/futex/core.c",
        code: '\nstatic struct {\n\tstruct futex_hash_bucket *queues;\n\tunsigned long            hashsize;\n} __futex_data __read_mostly __aligned(2*sizeof(long));\n\n#define futex_queues   (__futex_data.queues)\n#define futex_hashsize (__futex_data.hashsize)\n\n#ifdef CONFIG_FAIL_FUTEX\n\nstatic struct {\n\tstruct fault_attr attr;\n\n\tbool ignore_private;\n} fail_futex = {\n\t.attr = FAULT_ATTR_INITIALIZER,\n\t.ignore_private = false,\n};\n\nstatic int __init setup_fail_futex(char *str)\n{\n\treturn setup_fault_attr(&fail_futex.attr, str);\n}\n__setup("fail_futex=", setup_fail_futex);\n\nbool should_fail_futex(bool fshared)\n{\n\tif (fail_futex.ignore_private && !fshared)\n\t\treturn false;\n\n\treturn should_fail(&fail_futex.attr, 1);\n}\n\n#ifdef CONFIG_FAULT_INJECTION_DEBUG_FS\n\nstatic int __init fail_futex_debugfs(void)\n{\n\tumode_t mode = S_IFREG | S_IRUSR | S_IWUSR;\n\tstruct dentry *dir;\n\n\tdir = fault_create_debugfs_attr("fail_futex", NULL,\n\t\t\t\t\t&fail_futex.attr);\n\tif (IS_ERR(dir))\n\t\treturn PTR_ERR(dir);\n\n\tdebugfs_create_bool("ignore-private", mode, dir,\n\t\t\t    &fail_futex.ignore_private);\n\treturn 0;\n}'
    }, {
        path: "/crypto/aegis128-core.c",
        code: "\nstatic void crypto_aegis128_update(struct aegis_state *state)\n{\n\tunion aegis_block tmp;\n\tunsigned int i;\n\n\ttmp = state->blocks[AEGIS128_STATE_BLOCKS - 1];\n\tfor (i = AEGIS128_STATE_BLOCKS - 1; i > 0; i--)\n\t\tcrypto_aegis_aesenc(&state->blocks[i], &state->blocks[i - 1],\n\t\t\t\t    &state->blocks[i]);\n\tcrypto_aegis_aesenc(&state->blocks[0], &tmp, &state->blocks[0]);\n}\n\nstatic void crypto_aegis128_update_a(struct aegis_state *state,\n\t\t\t\t     const union aegis_block *msg,\n\t\t\t\t     bool do_simd)\n{\n\tif (IS_ENABLED(CONFIG_CRYPTO_AEGIS128_SIMD) && do_simd) {\n\t\tcrypto_aegis128_update_simd(state, msg);\n\t\treturn;\n\t}\n\n\tcrypto_aegis128_update(state);\n\tcrypto_aegis_block_xor(&state->blocks[0], msg);\n}\n\nstatic void crypto_aegis128_update_u(struct aegis_state *state, const void *msg,\n\t\t\t\t     bool do_simd)\n{\n\tif (IS_ENABLED(CONFIG_CRYPTO_AEGIS128_SIMD) && do_simd) {\n\t\tcrypto_aegis128_update_simd(state, msg);\n\t\treturn;\n\t}\n\n\tcrypto_aegis128_update(state);\n\tcrypto_xor(state->blocks[0].bytes, msg, AEGIS_BLOCK_SIZE);\n}\n"
    }, {
        path: "/drivers/base/bus.c",
        code: "\nstatic struct subsys_private *bus_to_subsys(const struct bus_type *bus)\n{\n\tstruct subsys_private *sp = NULL;\n\tstruct kobject *kobj;\n\n\tif (!bus || !bus_kset)\n\t\treturn NULL;\n\n\tspin_lock(&bus_kset->list_lock);\n\n\tif (list_empty(&bus_kset->list))\n\t\tgoto done;\n\n\tlist_for_each_entry(kobj, &bus_kset->list, entry) {\n\t\tstruct kset *kset = container_of(kobj, struct kset, kobj);\n\n\t\tsp = container_of_const(kset, struct subsys_private, subsys);\n\t\tif (sp->bus == bus)\n\t\t\tgoto done;\n\t}\n\tsp = NULL;\ndone:\n\tsp = subsys_get(sp);\n\tspin_unlock(&bus_kset->list_lock);\n\treturn sp;\n}\n\nstatic struct bus_type *bus_get(struct bus_type *bus)\n{\n\tstruct subsys_private *sp = bus_to_subsys(bus);\n\n\tif (sp)\n\t\treturn bus;\n\treturn NULL;\n}\n"
    }, {
        path: "/mm/compaction.c",
        code: "\nstatic void split_map_pages(struct list_head *list)\n{\n\tunsigned int i, order, nr_pages;\n\tstruct page *page, *next;\n\tLIST_HEAD(tmp_list);\n\n\tlist_for_each_entry_safe(page, next, list, lru) {\n\t\tlist_del(&page->lru);\n\n\t\torder = page_private(page);\n\t\tnr_pages = 1 << order;\n\n\t\tpost_alloc_hook(page, order, __GFP_MOVABLE);\n\t\tif (order)\n\t\t\tsplit_page(page, order);\n\n\t\tfor (i = 0; i < nr_pages; i++) {\n\t\t\tlist_add(&page->lru, &tmp_list);\n\t\t\tpage++;\n\t\t}\n\t}\n\n\tlist_splice(&tmp_list, list);\n}\n\nbool PageMovable(struct page *page)\n{\n\tconst struct movable_operations *mops;\n\n\tVM_BUG_ON_PAGE(!PageLocked(page), page);\n\tif (!__PageMovable(page))\n\t\treturn false;\n\n\tmops = page_movable_ops(page);\n\tif (mops)\n\t\treturn true;\n\n\treturn false;\n}\n"
    }, {
        path: "/sound/firewire/amdtp-stream.c",
        code: "\nint amdtp_stream_set_parameters(struct amdtp_stream *s, unsigned int rate,\n\t\t\t\tunsigned int data_block_quadlets, unsigned int pcm_frame_multiplier)\n{\n\tunsigned int sfc;\n\tfor (sfc = 0; sfc < ARRAY_SIZE(amdtp_rate_table); ++sfc) {\n\t\tif (amdtp_rate_table[sfc] == rate)\n\t\t\tbreak;\n\t}\n\tif (sfc == ARRAY_SIZE(amdtp_rate_table))\n\t\treturn -EINVAL;\n\ts->sfc = sfc;\n\ts->data_block_quadlets = data_block_quadlets;\n\ts->syt_interval = amdtp_syt_intervals[sfc];\n\ts->transfer_delay = TRANSFER_DELAY_TICKS - TICKS_PER_CYCLE;\n\tif (s->flags & CIP_BLOCKING)\n\t\ts->transfer_delay += TICKS_PER_SECOND * s->syt_interval / rate;\n\n\ts->pcm_frame_multiplier = pcm_frame_multiplier;\n\n\treturn 0;\n}\nEXPORT_SYMBOL(amdtp_stream_set_parameters);\nstatic int amdtp_stream_get_max_ctx_payload_size(struct amdtp_stream *s)\n{\n\tunsigned int multiplier;\n\tif (s->flags & CIP_JUMBO_PAYLOAD)\n\t\tmultiplier = IR_JUMBO_PAYLOAD_MAX_SKIP_CYCLES;\n\telse\n\t\tmultiplier = 1;\n\treturn s->syt_interval * s->data_block_quadlets * sizeof(__be32) * multiplier;\n}\n"
    }]
}, {
    label: "React",
    url: "https://github.com/facebook/react",
    files: [{
        path: "/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js",
        code: "\ntype ReactDOMServerReadableStream = ReadableStream & {\n  allReady: Promise<void>,\n};\n\nfunction renderToReadableStream(\n  children: ReactNodeList,\n  options?: Options,\n): Promise<ReactDOMServerReadableStream> {\n  return new Promise((resolve, reject) => {\n    let onFatalError;\n    let onAllReady;\n    const allReady = new Promise<void>((res, rej) => {\n      onAllReady = res;\n      onFatalError = rej;\n    });\n\n    function onShellReady() {\n      const stream: ReactDOMServerReadableStream = (new ReadableStream(\n        {\n          type: 'bytes',\n          pull: (controller): ?Promise<void> => {\n            startFlowing(request, controller);\n          },\n          cancel: (reason): ?Promise<void> => {\n            abort(request);\n          },\n        },\n        // $FlowFixMe size() methods are not allowed on byte streams.\n        {highWaterMark: 0},\n      ): any);\n      stream.allReady = allReady;\n      resolve(stream);\n    }\n"
    }, {
        path: "/packages/react/src/ReactElement.js",
        code: "\nconst RESERVED_PROPS = {\n  key: true,\n  ref: true,\n  __self: true,\n  __source: true,\n};\n\nlet specialPropKeyWarningShown,\n  specialPropRefWarningShown,\n  didWarnAboutStringRefs;\n\nif (__DEV__) {\n  didWarnAboutStringRefs = {};\n}\n\nfunction hasValidRef(config) {\n  if (__DEV__) {\n    if (hasOwnProperty.call(config, 'ref')) {\n      const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;\n      if (getter && getter.isReactWarning) {\n        return false;\n      }\n    }\n  }\n  return config.ref !== undefined;\n}\n\nfunction hasValidKey(config) {\n  if (__DEV__) {\n    if (hasOwnProperty.call(config, 'key')) {\n      const getter = Object.getOwnPropertyDescriptor(config, 'key').get;\n      if (getter && getter.isReactWarning) {\n        return false;\n      }\n    }\n  }\n  return config.key !== undefined;\n}\n"
    }, {
        path: "/packages/react-cache/src/LRU.js",
        code: "\nfunction deleteLeastRecentlyUsedEntries(targetSize: number) {\n\tif (first !== null) {\n\t\tconst resolvedFirst: Entry<T> = (first: any);\n\t\tlet last: null | Entry<T> = resolvedFirst.previous;\n\t\twhile (size > targetSize && last !== null) {\n\t\t\tconst onDelete = last.onDelete;\n\t\t\tconst previous = last.previous;\n\t\t\tlast.onDelete = (null: any);\n\t\t\tlast.previous = last.next = (null: any);\n\t\t\tif (last === first) {\n\t\t\t\tfirst = last = null;\n\t\t\t} else {\n\t\t\t\t(first: any).previous = previous;\n\t\t\t\tprevious.next = (first: any);\n\t\t\t\tlast = previous;\n\t\t\t}\n\t\t\tsize -= 1;\n\t\t\tonDelete();\n\t\t}\n\t}\n}\n"
    }, {
        path: "/packages/react-art/src/ReactART.js",
        code: "\nclass Surface extends React.Component {\n  componentDidMount() {\n    const {height, width} = this.props;\n    this._surface = Mode.Surface(+width, +height, this._tagRef);\n    this._mountNode = createContainer(\n      this._surface,\n      LegacyRoot,\n      null,\n      false,\n      false,\n      '',\n    );\n    updateContainer(this.props.children, this._mountNode, this);\n  }\n  componentDidUpdate(prevProps, prevState) {\n    const props = this.props;\n    if (props.height !== prevProps.height || props.width !== prevProps.width) {\n      this._surface.resize(+props.width, +props.height);\n    }\n    updateContainer(this.props.children, this._mountNode, this);\n    if (this._surface.render) {\n      this._surface.render();\n    }\n  }\n  componentWillUnmount() {\n    updateContainer(null, this._mountNode, this);\n  }\n  render() {\n    const props = this.props;\n    const Tag = Mode.Surface.tagName;\n    return (\n      <Tag\n        ref={ref => (this._tagRef = ref)}\n        accessKey={props.accessKey}\n        className={props.className}\n        draggable={props.draggable}\n        role={props.role}\n        style={props.style}\n        tabIndex={props.tabIndex}\n        title={props.title}\n      />\n    );\n  }\n}\n"
    }, {
        path: "/packages/react/src/ReactChildren.js",
        code: "\nfunction mapIntoArray(\n  children: ?ReactNodeList,\n  array: Array<React$Node>,\n  escapedPrefix: string,\n  nameSoFar: string,\n  callback: (?React$Node) => ?ReactNodeList,\n): number {\n  const type = typeof children;\n\n  if (type === 'undefined' || type === 'boolean') {\n    // All of the above are perceived as null.\n    children = null;\n  }\n\n  let invokeCallback = false;\n\n  if (children === null) {\n    invokeCallback = true;\n  } else {\n    switch (type) {\n      case 'string':\n      case 'number':\n        invokeCallback = true;\n        break;\n      case 'object':\n        switch ((children: any).$$typeof) {\n          case REACT_ELEMENT_TYPE:\n          case REACT_PORTAL_TYPE:\n            invokeCallback = true;\n        }\n    }\n  }\n  if (invokeCallback) {\n    const child = children;\n    let mappedChild = callback(child);\n    const childKey =\n      nameSoFar === '' ? SEPARATOR + getElementKey(child, 0) : nameSoFar;\n    if (isArray(mappedChild)) {\n      let escapedChildKey = '';\n      if (childKey != null) {\n        escapedChildKey = escapeUserProvidedKey(childKey) + '/';\n      }\n      mapIntoArray(mappedChild, array, escapedChildKey, '', c => c);\n    } else if (mappedChild != null) {\n      if (isValidElement(mappedChild)) {\n        if (__DEV__) {\n          if (mappedChild.key && (!child || child.key !== mappedChild.key)) {\n            checkKeyStringCoercion(mappedChild.key);\n          }\n        }\n        mappedChild = cloneAndReplaceKey(\n          mappedChild,\n          escapedPrefix +\n            (mappedChild.key && (!child || child.key !== mappedChild.key)\n              ? escapeUserProvidedKey(\n                  '' + mappedChild.key, // eslint-disable-line react-internal/safe-string-coercion\n                ) + '/'\n              : '') +\n            childKey,\n        );\n      }\n      array.push(mappedChild);\n    }\n    return 1;\n  }\n\n  let child;\n  let nextName;\n  let subtreeCount = 0;\n  const nextNamePrefix =\n    nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;\n\n  if (isArray(children)) {\n    for (let i = 0; i < children.length; i++) {\n      child = children[i];\n      nextName = nextNamePrefix + getElementKey(child, i);\n      subtreeCount += mapIntoArray(\n        child,\n        array,\n        escapedPrefix,\n        nextName,\n        callback,\n      );\n    }\n  } else {\n    const iteratorFn = getIteratorFn(children);\n    if (typeof iteratorFn === 'function') {\n      const iterableChildren: Iterable<React$Node> & {\n        entries: any,\n      } = (children: any);\n\n      const iterator = iteratorFn.call(iterableChildren);\n      let step;\n      let ii = 0;\n      while (!(step = iterator.next()).done) {\n        child = step.value;\n        nextName = nextNamePrefix + getElementKey(child, ii++);\n        subtreeCount += mapIntoArray(\n          child,\n          array,\n          escapedPrefix,\n          nextName,\n          callback,\n        );\n      }\n    } else if (type === 'object') {\n      const childrenString = String((children: any));\n\n      throw new Error(\n        `Objects are not valid as a React child (found: ${\n          childrenString === '[object Object]'\n            ? 'object with keys {' +\n              Object.keys((children: any)).join(', ') +\n              '}'\n            : childrenString\n        }). ` +\n          'If you meant to render a collection of children, use an array ' +\n          'instead.',\n      );\n    }\n  }\n\n  return subtreeCount;\n}\n"
    }]
}, {
    label: "TensorFlow",
    url: "https://github.com/tensorflow/tensorflow",
    files: [{
        path: "/tensorflow/python/autograph/impl/conversion.py",
        code: "\n_ALLOWLIST_CACHE = cache.UnboundInstanceCache()\n\ndef _is_of_known_loaded_module(f, module_name):\n  mod = sys.modules.get(module_name, None)\n  if mod is None:\n    return False\n  if any(v is not None for v in mod.__dict__.values() if f is v):\n    return True\n  return False\n\ndef _is_known_loaded_type(f, module_name, entity_name):\n  if (module_name not in sys.modules or\n      not hasattr(sys.modules[module_name], entity_name)):\n    return False\n  type_entity = getattr(sys.modules[module_name], entity_name)\n  if isinstance(f, type_entity):\n    return True\n  if inspect.ismethod(f):\n    if isinstance(f.__func__, type_entity):\n      return True\n  return False\n"
    }, {
        path: "/tensorflow/python/framework/combinations.py",
        code: '\nclass EagerGraphCombination(test_combinations.TestCombination):\n  """\n  The optional `mode` parameter controls the test\'s execution mode.  Its\n  accepted values are "graph" or "eager" literals.\n  """\n\n  def context_managers(self, kwargs):\n    mode = kwargs.pop("mode", None)\n    if mode is None:\n      return []\n    elif mode == "eager":\n      return [context.eager_mode()]\n    elif mode == "graph":\n      return [ops.Graph().as_default(), context.graph_mode()]\n    else:\n      raise ValueError(\n          "Argument \'mode\' must be either \'eager\' or \'graph\'. "\n          f"Received: {mode}.")\n\n  def parameter_modifiers(self):\n    return [test_combinations.OptionalParameter("mode")]\n\nclass TFVersionCombination(test_combinations.TestCombination):\n  def should_execute_combination(self, kwargs):\n    tf_api_version = kwargs.pop("tf_api_version", None)\n    if tf_api_version == 1 and tf2.enabled():\n      return (False, "Skipping a TF1.x test when TF2 is enabled.")\n    elif tf_api_version == 2 and not tf2.enabled():\n      return (False, "Skipping a TF2 test when TF2 is not enabled.")\n    return (True, None)\n'
    }, {
        path: "/tensorflow/core/kernels/linalg/determinant_op.cc",
        code: "\nnamespace tensorflow {\n\ttemplate <class Scalar>\n\tstatic typename Eigen::NumTraits<Scalar>::Real SLogDet(\n\t\t\tconst Eigen::Matrix<Scalar, Eigen::Dynamic, Eigen::Dynamic>& inputs,\n\t\t\tScalar* sign) {\n\t\tusing RealScalar = typename Eigen::NumTraits<Scalar>::Real;\n\t\tRealScalar log_abs_det = 0;\n\t\t*sign = 1;\n\t\tif (inputs.size() > 0) {\n\t\t\tusing Eigen::Dynamic;\n\t\t\tEigen::PartialPivLU<Eigen::Matrix<Scalar, Dynamic, Dynamic>> lu(inputs);\n\t\t\tEigen::Matrix<Scalar, Dynamic, Dynamic> LU = lu.matrixLU();\n\t\t\t*sign = lu.permutationP().determinant();\n\t\t\tauto diag = LU.diagonal().array().eval();\n\t\t\tauto abs_diag = diag.cwiseAbs().eval();\n\t\t\tlog_abs_det += abs_diag.log().sum();\n\t\t\t*sign *= (diag / abs_diag).prod();\n\t\t}\n\t\tif (!Eigen::numext::isfinite(log_abs_det)) {\n\t\t\t*sign = 0;\n\t\t\tlog_abs_det =\n\t\t\t\t\tlog_abs_det > 0 ? -std::log(RealScalar(0)) : std::log(RealScalar(0));\n\t\t}\n\t\treturn log_abs_det;\n\t}\n}\n"
    }, {
        path: "/tensorflow/core/grappler/graph_topology_view.cc",
        code: '\ntemplate <typename T>\ninline void SortAndRemoveDuplicates(T* v) {\n  std::sort(v->begin(), v->end());\n  v->erase(std::unique(v->begin(), v->end()), v->end());\n}\n\nStatus GraphTopologyView::InitializeFromGraph(\n    const GraphDef& graph,\n    const absl::Span<const GraphView::Edge> ephemeral_edges,\n    bool ignore_control_edges) {\n  if (graph_ != nullptr) {\n    return errors::InvalidArgument("GraphTopologyView is already initialized.");\n  }\n\n  graph_ = &graph;\n  num_nodes_ = graph.node_size();\n  index_to_node_name_.resize(num_nodes_);\n  node_name_to_index_.rehash(num_nodes_);\n  fanins_.resize(num_nodes_);\n  fanouts_.resize(num_nodes_);\n\n  for (int node_idx = 0; node_idx < num_nodes_; ++node_idx) {\n    const NodeDef& node = graph.node(node_idx);\n    node_name_to_index_.emplace(node.name(), node_idx);\n    index_to_node_name_.emplace_back(node.name());\n  }\n'
    }, {
        path: "/tensorflow/core/common_runtime/gpu/gpu_cudamalloc_allocator.cc",
        code: '\nvoid* GPUcudaMallocAllocator::AllocateRaw(size_t alignment, size_t num_bytes) {\n\t#ifdef GOOGLE_CUDA\n\t\t// allocate with cudaMalloc\n\t\tse::cuda::ScopedActivateExecutorContext scoped_activation{stream_exec_};\n\t\tCUdeviceptr rv = 0;\n\t\tCUresult res = cuMemAlloc(&rv, num_bytes);\n\t\tif (res != CUDA_SUCCESS) {\n\t\t\tconst char* error_name;\n\t\t\tconst char* error_string;\n\t\t\tcuGetErrorName(res, &error_name);\n\t\t\tcuGetErrorString(res, &error_string);\n\t\t\tLOG(ERROR) << "cuMemAlloc failed to allocate " << num_bytes\n\t\t\t\t\t\t\t\t << "\n Error name: " << error_name\n\t\t\t\t\t\t\t\t << "\n Error string: " << error_string;\n\t\t\treturn nullptr;\n\t\t}\n\t\tVLOG(10) << "AllocateRaw " << Name() << "  " << num_bytes << " "\n\t\t\t\t\t\t << reinterpret_cast<void*>(rv);\n\t\treturn reinterpret_cast<void*>(rv);\n\t#else\n\t\treturn nullptr;\n\t#endif  // GOOGLE_CUDA\n\t}\n'
    }]
}]
  , e = "Enter"
  , n = "Backspace"
  , a = document.getElementById("terminal")
  , r = document.getElementById("cursor")
  , s = "®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®"
  , i = () => {
    r.parentElement === a && a.removeChild(r)
}
  , o = async t => {
    i();
    for (const e of t)
        await l(e),
        d();
    a.appendChild(r)
}
  , l = t => new Promise((e => {
    let n = 0;
    const a = setInterval(( () => {
        c(t[n++]),
        n === t.length && (clearInterval(a),
        e())
    }
    ), 20)
}
))
  , c = t => {
    const e = document.createElement("span");
    e.textContent = t,
    a.appendChild(e),
    a.appendChild(r),
    a.scrollTop = a.scrollHeight
}
  , d = () => {
    a.appendChild(document.createElement("br"))
}
  , _ = /^[\w\d ]$/
  , p = () => new Promise((t => {
    let s = "";
    const i = o => {
        const l = o.key;
        _.test(l) ? (s += l,
        c(l)) : l === e && s.length > 0 ? (document.removeEventListener("keydown", i),
        d(),
        t(s)) : l === n && s.length > 0 && (s = s.slice(0, s.length - 1),
        ( () => {
            a.removeChild(r);
            const t = a.lastChild;
            t && a.removeChild(t),
            a.appendChild(r)
        }
        )())
    }
    ;
    l("$ "),
    document.addEventListener("keydown", i)
}
))
  , u = [["Come on, just type a", "It's simple, enter a number between 1 and 3, not a magic spell! 🧙‍♂️"], ["A", "Not a letter, I need a number between 1 and 3! Don't make me ask again! 🔢"], ["Alright, enough fun... Enter a", "This isn't a game, give me a number from 1 to 3, please! 🎮"], ["What does that even mean? Please, a", "Stop speaking in riddles, just give me 1, 2, or 3! 🤨"], ["Okay, seriously now... How about a", "We need a number, 1 to 3. It's not rocket science! 🚀"], ["Let me check... Nope, that's not a", "Try again with a number between 1 and 3! No more tricks! 🧐"], ["Come on, just type a", "It's a simple choice, between 1 and 3! No need for a fortune teller 🔮"], ["Another try? Give me a", "I'm running out of patience... just 1, 2, or 3! ⏳"], ["C'mon, don't leave me hanging! Give me a", "I need a number from 1 to 3, not your favorite color! 🌈"], ["Why so shy? Just type a", "No need to be scared, 1, 2, or 3 – your call! 🥳"]]
  , m = async t => {
    await o([...t.map(( (t, e) => `${e + 1}. ${t.label}`)), " "]);
    let e = 0
      , n = -1;
    for (; -1 === n; ) {
        const a = parseInt(await p());
        if (a > 0 && a <= t.length)
            n = a - 1;
        else {
            const n = u[e++];
            e %= u.length,
            await o([" ", `${n[0]} number between 1 and ${t.length}.`, n[1], " "])
        }
    }
    return t[n]
}
  , f = () => {
    a.innerHTML = ""
}
  , h = document.getElementById("editor")
  , g = document.getElementById("stats")
  , y = 45e3
  , b = "cursor"
  , v = "next"
  , E = "wrong"
  , C = /\s/
  , S = t => {
    h.innerHTML = "";
    let e = 0;
    for (const n of t) {
        for (const t of n) {
            const n = document.createElement("span");
            n.innerText = t,
            e > 0 && n.classList.add("next"),
            C.test(t) && n.setAttribute("data-whitespace", "true"),
            h.appendChild(n),
            e++
        }
        h.appendChild(document.createElement("br"))
    }
    const n = h.firstChild;
    return n.classList.add(b),
    n
}
  , k = t => {
    const e = ((y - t.totalTime) / 1e3).toFixed(0);
    g.innerHTML = ["", s, `Time left: ${e} seconds`, `Characters typed: ${t.totalCharacters}`, "Errors: " + (t.totalCharacters - t.correctCharacters)].join("<br/>")
}
  , R = t => (t = (t => t.trim().replace(/\t/g, "  "))(t),
new Promise((async a => {
    const r = t.split(/[ \t]*\r?\n/).filter((t => t.trim().length > 0)).map((t => t + " "));
    let s = 0
      , i = 0
      , o = 0
      , l = 0
      , c = 0
      , d = r.slice(s, 3)
      , _ = d[o]
      , p = S(d)
      , u = 0
      , m = 0
      , f = 0
      , h = [];
    const g = t => {
        p.classList.remove(b),
        t || p.classList.add(E),
        p = p.nextElementSibling,
        p.classList.remove(v),
        p.classList.add(b),
        h.push(t),
        i++
    }
      , R = () => {
        for (; i + 0 < _.length - 1 && C.test(_[i + 0]); )
            g(!0)
    }
      , w = () => {
        const t = (new Date).valueOf() - u;
        return {
            correctCharacters: c,
            totalCharacters: l,
            totalTime: t,
            reachedTheEnd: t <= y
        }
    }
      , x = () => {
        document.removeEventListener("keydown", T),
        clearTimeout(m),
        clearInterval(f),
        a(w())
    }
      , L = t => {
        if (1 === t.length && i < _.length - 1) {
            0 === u && (u = (new Date).valueOf(),
            m = setTimeout(x, y),
            f = setInterval(( () => k(w())), 1e3));
            const e = t === _[i];
            g(e),
            c += e ? 1 : 0,
            l++,
            i === _.length - 1 && o === d.length - 1 && (s < r.length - 1 ? (s += d.length,
            d = r.slice(s, s + 3),
            o = 0,
            i = 0,
            _ = d[o],
            p = S(d),
            R()) : x())
        } else
            i > 0 && t === n ? (p.classList.remove(b),
            p.classList.add(v),
            p = p.previousElementSibling,
            p.classList.remove(E),
            p.classList.add(b),
            i--,
            h[i] && c--,
            h = h.slice(0, -1)) : i === _.length - 1 && t === e && (l++,
            c++,
            o < d.length - 1 && (_ = d[++o],
            i = 0,
            h = [],
            p.classList.remove(b),
            p = p.nextElementSibling?.nextElementSibling,
            p.classList.remove(v),
            p.classList.add(b),
            R()));
        k(w())
    }
      , T = t => {
        const e = t.key;
        "Tab" === e ? (L(" "),
        L(" "),
        t.preventDefault(),
        t.stopPropagation()) : L(e)
    }
    ;
    document.addEventListener("keydown", T)
}
)))
  , w = (t, e) => 1 === t ? "Welcome to coder type! 🥳" : e ? "Yay! Let's play again! 😋" : "Ah whatever, I'm just gonna let you play again! 😇"
  , x = async (t, e) => {
    f(),
    await o([`${t.label} it is!`, s, `Repo: ${t.url}`, `File: ${e.path}`, " ", "When you are ready, start typing! ⌨️", s, " "])
}
  , L = async t => {
    const e = t.totalCharacters - t.correctCharacters
      , n = t.totalCharacters > 0 ? t.correctCharacters / t.totalCharacters * 100 : 0
      , a = t.correctCharacters / t.totalTime * 6e4;
    await o([t.reachedTheEnd ? "Wow you've completed the entire snippet ✅" : "Time's up!! ⌛️", "Here are your results:", s, " ", `Correct characters per minute: ${a.toFixed(2)}`, "Total errors: " + (e > 0 ? e : "No errors, what a performance!"), `Accuracy: ${n.toFixed(2)}%`, " ", s, "Wanna play again? (y, n)", " "])
}
;
(async () => {
    let e = 1
      , n = !0;
    for (; ; ) {
        f(),
        await o([w(e, n), "Please select practice repo:", " "]);
        const a = await m(t)
          , r = a.files[Math.floor(Math.random() * a.files.length)];
        await x(a, r),
        i();
        const s = await R(r.code);
        h.innerHTML = "",
        g.innerHTML = "",
        f(),
        await L(s),
        n = "y" === await p(),
        e++
    }
}
)();