type titleProps = {
  title: string;
};
const Title = (props: titleProps) => {
  const { title } = props;
  return (
    <div className="w-10 border-b pb-1 h-fit border-b-primary text-nowrap overflow-x-visible">
      {title}
    </div>
  );
};

export default Title;
