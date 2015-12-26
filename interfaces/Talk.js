type Speaker = {
  id: number,
  public_name: string,
};

declare class BaseTalk {
  id: number;
  guid: string;
  start: string;
  room: string;
  slug: string;
  title: string;
  language: string;
  do_not_record: bool;
  persons: Array<Speaker>;
}

declare class RawTalk extends BaseTalk {
  date: string;
  duration: string;
}

declare class Talk extends BaseTalk {
  date: Object;
  duration: Object;
}
