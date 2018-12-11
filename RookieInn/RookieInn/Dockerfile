FROM ubuntu

# 更新软件源，必须。-y跳过提示直接安装
RUN apt-get -y update

RUN apt-get install -y python2.7
RUN apt-get install -y python-pip

RUN mkdir /RookieInn

# 设置工作目录
WORKDIR /RookieInn

# 将当前目录添加到工作目录
ADD . /RookieInn

# 所有需要安装的python模块在该文件中
RUN pip install -r requirements.txt

# 对外暴露端口
EXPOSE 80 8080 8000 5000

# 设置环境变量
ENV SPIDER=/RookieInn
