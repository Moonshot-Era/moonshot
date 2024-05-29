type ServerPageProps<T extends {} = {}> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};
