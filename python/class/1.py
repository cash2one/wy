#!/user/bin/env python
# coding: utf-8

# 普通类定义
class People:
    # 定义基本属性，外部也可以访问
    name = ""
    age = 0
    # 定义私有属性，外部无法访问，私有方法，也是 __ 开头
    __weight = 0
    # 定义构造方法
    def __init__(self, name, age, weight = 30):
        self.name = name
        self.age = age
        self.__weight = weight
    # 其它方法
    def speak(self):
        print('%s is speaking: I am %s years old' % (self.name, self.age))

p = People('Tom', 10)
p.speak()


# 类继承，多继承，使用逗号隔开
class Student(People):
    grade = ''
    def __init__(self, name, age, weight = 30, grade = 'one'):
        # 调用父类
        People.__init__(self, name, age, weight)
        self.grade = grade
    # 重写父类的方法
    def speak(self):
        People.speak(self)
        print("I am in grade %s" % (self.grade))

student = Student('Ken', 20, 50, 11)
student.speak()

# 两个类型，都是 dict
print type(student.__dict__)
print type(vars(student))

print u'\n 遍历方式1:'
for (key,value) in student.__dict__.items():
    print '%s: %s' % (key, value)

print u'\n遍历方式2:'
for (key, value) in vars(student).items():
    print '%s: %s' % (key, value)

'''
__init__  构造函数，在生成对象时调用
__del__   析构函数，释放对象时使用
__repr__ 打印，转换
__setitem__按照索引赋值
__getitem__按照索引获取值
__len__获得长度
__cmp__比较运算
__call__函数调用

__add__加运算
__sub__减运算
__mul__乘运算
__div__除运算
__mod__求余运算
__pow__称方

__dict__ 类的所有属性
'''
