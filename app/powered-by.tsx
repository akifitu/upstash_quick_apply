const PoweredBy = () => {
  return (
    <p className="mt-4 text-xs md:text-sm text-gray-600 text-center">
      This project is a prototype for a RAG chatbot. <br /> Built using{" "}
      <a href="https://www.langchain.com/" target="_blank">
        LangChain
      </a>
      ,{" "}
      <a href="https://upstash.com" target="_blank">
        Upstash Vector
      </a>{" "}
      and{" "}
      <a href="https://upstash.com" target="_blank">
        Upstash Redis
      </a>{" "}
      ・{" "}
      <a href="https://github.com/upstash/QuickApply" target="_blank">
        Source Code
      </a>
    </p>
  );
};

export default PoweredBy;
