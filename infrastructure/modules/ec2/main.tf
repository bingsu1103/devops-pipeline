variable "env" { type = string }
variable "instance_type" { type = string }
variable "public_subnet_id" { type = string }
variable "vpc_id" { type = string }
variable "instance_name" { type = string }
variable "app_port" { type = number }
variable "ssh_key" { type = string } # Biến mới để nhận tên Key Pair từ AWS

# Tự động tìm Amazon Linux 2023 ARM64 mới nhất
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-arm64"]
  }
}

resource "aws_security_group" "app_sg" {
  name   = "${var.instance_name}-sg-${var.env}"
  vpc_id = var.vpc_id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # App Port (7070/3000)
  ingress {
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  subnet_id     = var.public_subnet_id
  key_name      = var.ssh_key # Gắn khóa để có thể SSH vào
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = { Name = "${var.instance_name}-${var.env}" }
}

output "instance_public_ip" { value = aws_instance.web.public_ip }
